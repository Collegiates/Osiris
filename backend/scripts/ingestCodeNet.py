from __future__ import annotations

import argparse
import gzip
import hashlib
import json
import sys
from pathlib import Path

# Ensure the .env in backend/ is always found, regardless of cwd.
_BACKEND_DIR = Path(__file__).resolve().parent.parent
_ENV_PATH = _BACKEND_DIR / ".env"
from typing import Any

# Ensure the project root (Osiris/) is on sys.path so "backend" resolves as a package.
_PROJECT_ROOT = str(Path(__file__).resolve().parent.parent.parent)
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

from dotenv import load_dotenv
load_dotenv(_ENV_PATH)

from backend.database.supabaseClient import getSupabaseClient


def parseArgs() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ingest CodeNet problems and tests into Supabase.")
    parser.add_argument("--codeNetRoot", required=True, help="Path to Project_CodeNet root.")
    parser.add_argument("--language", default="python", help="Language label to store in allowedLanguages.")
    parser.add_argument("--limit", type=int, default=150, help="Max number of problems to ingest.")
    parser.add_argument("--force", action="store_true", help="Re-ingest existing problems.")
    return parser.parse_args()


def loadProblemIds(codeNetRoot: Path) -> list[str]:
    inputOutputDir = codeNetRoot / "derived" / "input_output" / "data"
    if not inputOutputDir.exists():
        raise FileNotFoundError(f"Missing input_output directory: {inputOutputDir}")
    problemIds = [item.name for item in inputOutputDir.iterdir() if item.is_dir()]
    problemIds.sort()
    return problemIds


def loadStatementMarkdown(codeNetRoot: Path, problemId: str) -> str:
    candidates = [
        codeNetRoot / "derived" / "problem_descriptions" / problemId / "problem.md",
        codeNetRoot / "derived" / "problem_descriptions" / problemId / "problem.html",
        codeNetRoot / "derived" / "problem_description" / problemId / "problem.md",
        codeNetRoot / "derived" / "problem_description" / problemId / "problem.html",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate.read_text(encoding="utf-8")
    return f"CodeNet problem {problemId}."


def buildTestsPayload(problemId: str, inputText: str, outputText: str) -> dict[str, Any]:
    return {
        "problemId": problemId,
        "tests": [
            {
                "input": inputText,
                "expectedOutput": outputText,
            }
        ],
    }


def gzipJson(payload: dict[str, Any]) -> bytes:
    rawBytes = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    return gzip.compress(rawBytes)


def computeChecksum(dataBytes: bytes) -> str:
    return hashlib.sha256(dataBytes).hexdigest()


def ensureTopicId(supabaseClient, slug: str, name: str) -> str:
    response = (
        supabaseClient
        .table("topics")
        .select("id")
        .eq("slug", slug)
        .limit(1)
        .execute()
    )
    data = response.data or []
    if data:
        return data[0]["id"]

    insertResponse = (
        supabaseClient
        .table("topics")
        .insert({"slug": slug, "name": name, "description": "General foundations"})
        .execute()
    )
    return insertResponse.data[0]["id"]


def getExistingProblemVersionId(supabaseClient, problemId: str) -> str | None:
    response = (
        supabaseClient
        .table("problem_versions")
        .select("id")
        .eq("sourcedataset", "codenet")
        .eq("externalid", problemId)
        .limit(1)
        .execute()
    )
    data = response.data or []
    if data:
        return data[0]["id"]
    return None


def testSuiteExists(supabaseClient, problemVersionId: str, language: str) -> bool:
    response = (
        supabaseClient
        .table("test_suites")
        .select("id")
        .eq("problem_version_id", problemVersionId)
        .eq("language", language)
        .limit(1)
        .execute()
    )
    return bool(response.data)


def storageObjectExists(supabaseClient, bucketName: str, objectKey: str) -> bool:
    parentPath = str(Path(objectKey).parent)
    fileName = Path(objectKey).name
    response = supabaseClient.storage.from_(bucketName).list(parentPath)
    files = response.get("data") if isinstance(response, dict) else response
    files = files or []
    return any(item.get("name") == fileName for item in files)


def uploadTestSuite(
    supabaseClient,
    bucketName: str,
    objectKey: str,
    payload: dict[str, Any],
) -> tuple[str, str]:
    gzipBytes = gzipJson(payload)
    checksum = computeChecksum(gzipBytes)
    supabaseClient.storage.from_(bucketName).upload(
        objectKey,
        gzipBytes,
        file_options={"content-type": "application/gzip"},
    )
    return objectKey, checksum


def insertProblemVersion(
    supabaseClient,
    problemId: str,
    title: str,
    statementMarkdown: str,
    topicId: str,
    language: str,
    testsObjectKey: str | None,
) -> str:
    problemInsert = (
        supabaseClient
        .table("problems")
        .insert({"visibility": "public"})
        .execute()
    )
    problemRow = problemInsert.data[0]

    versionInsert = (
        supabaseClient
        .table("problem_versions")
        .insert(
            {
                "problem_id": problemRow["id"],
                "content_version": 1,
                "title": title,
                "summary": None,
                "statement_md": statementMarkdown,
                "difficulty": "medium",
                "topic_id": topicId,
                "source": "codenet",
                "sourcedataset": "codenet",
                "externalid": problemId,
                "allowedlanguages": [language],
                "tests_object_key": testsObjectKey,
                "is_published": True,
            }
        )
        .execute()
    )
    versionRow = versionInsert.data[0]

    supabaseClient.table("problems").update(
        {"current_version_id": versionRow["id"]}
    ).eq("id", problemRow["id"]).execute()

    return versionRow["id"]


def updateProblemVersionTests(
    supabaseClient,
    problemVersionId: str,
    testsObjectKey: str,
    language: str,
) -> None:
    supabaseClient.table("problem_versions").update(
        {"tests_object_key": testsObjectKey}
    ).eq("id", problemVersionId).execute()

    existing = testSuiteExists(supabaseClient, problemVersionId, language)
    if not existing:
        supabaseClient.table("test_suites").insert(
            {
                "problem_version_id": problemVersionId,
                "object_key": testsObjectKey,
                "language": language,
                "checksum": None,
            }
        ).execute()


def main() -> None:
    args = parseArgs()
    codeNetRoot = Path(args.codeNetRoot).expanduser().resolve()
    language = args.language
    limit = args.limit
    force = args.force

    supabaseClient = getSupabaseClient()
    bucketName = "problem-tests"

    problemIds = loadProblemIds(codeNetRoot)[:limit]
    print(f"Found {len(problemIds)} problems (limit={limit})")
    topicId = ensureTopicId(supabaseClient, "foundations", "Foundations")
    print(f"Topic ID: {topicId}")
    ingested = 0
    skipped = 0

    for problemId in problemIds:
        inputPath = codeNetRoot / "derived" / "input_output" / "data" / problemId / "input.txt"
        outputPath = codeNetRoot / "derived" / "input_output" / "data" / problemId / "output.txt"

        if not inputPath.exists() or not outputPath.exists():
            skipped += 1
            continue

        existingVersionId = getExistingProblemVersionId(supabaseClient, problemId)
        if existingVersionId and not force:
            skipped += 1
            continue

        inputText = inputPath.read_text(encoding="utf-8")
        outputText = outputPath.read_text(encoding="utf-8")
        testsPayload = buildTestsPayload(problemId, inputText, outputText)
        testsObjectKey = f"codenet/{problemId}/tests.json.gz"

        if existingVersionId and force:
            objectAlreadyExists = storageObjectExists(supabaseClient, bucketName, testsObjectKey)
            if not objectAlreadyExists:
                objectKey, checksum = uploadTestSuite(
                    supabaseClient, bucketName, testsObjectKey, testsPayload
                )
                updateProblemVersionTests(supabaseClient, existingVersionId, objectKey, language)
                supabaseClient.table("test_suites").update({"checksum": checksum}).eq(
                    "problem_version_id", existingVersionId
                ).eq("language", language).execute()
            else:
                updateProblemVersionTests(supabaseClient, existingVersionId, testsObjectKey, language)
            continue

        objectExists = storageObjectExists(supabaseClient, bucketName, testsObjectKey)
        checksum = None
        if not objectExists:
            objectKey, checksum = uploadTestSuite(
                supabaseClient, bucketName, testsObjectKey, testsPayload
            )
            testsObjectKey = objectKey

        statementMarkdown = loadStatementMarkdown(codeNetRoot, problemId)
        problemVersionId = insertProblemVersion(
            supabaseClient,
            problemId,
            title=problemId,
            statementMarkdown=statementMarkdown,
            topicId=topicId,
            language=language,
            testsObjectKey=testsObjectKey,
        )

        if not testSuiteExists(supabaseClient, problemVersionId, language):
            supabaseClient.table("test_suites").insert(
                {
                    "problem_version_id": problemVersionId,
                    "object_key": testsObjectKey,
                    "language": language,
                    "checksum": checksum,
                }
            ).execute()

        ingested += 1
        print(f"  [{ingested}/{len(problemIds)}] Ingested {problemId}")

    print(f"\nDone. Ingested: {ingested}, Skipped: {skipped}")


if __name__ == "__main__":
    main()
