from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, Header, HTTPException, Query, status

from backend.core.auth import requireUser
from backend.database.supabaseClient import getSupabaseClient
from backend.models.schemas import (
    ProblemDetailResponse,
    ProblemListItem,
    ProblemRunRequest,
    ProblemRunResponse,
    ProblemSubmitRequest,
    ProblemSubmitResponse,
)
from backend.services.executionRegistry import getLanguageConfig, getProviderMode

router = APIRouter(prefix="/problems", tags=["problems"])


def getPublishedProblemVersion(supabaseClient, problemId: str) -> dict:
    response = (
        supabaseClient
        .table("problem_versions")
        .select("id, problem_id, allowedlanguages")
        .eq("problem_id", problemId)
        .eq("is_published", True)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    items = response.data or []
    if not items:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")
    return items[0]


def ensureLanguageIsAllowed(requestedLanguageKey: str, allowedLanguageValues: object):
    languageConfig = getLanguageConfig(requestedLanguageKey)
    if languageConfig is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported language")
    if not languageConfig.isEnabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Language is disabled")

    if isinstance(allowedLanguageValues, list) and allowedLanguageValues:
        normalizedAllowedLanguages = {str(item).strip().lower() for item in allowedLanguageValues}
        if languageConfig.languageKey not in normalizedAllowedLanguages:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Language is not allowed for this problem",
            )
    return languageConfig


def raiseExecutionUnavailable(languageKey: str):
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "code": "execution_provider_unavailable",
            "providerMode": getProviderMode(),
            "languageKey": languageKey,
            "message": "Code execution is deferred to Stage 4.5 until Judge0 runtime is enabled.",
        },
    )


@router.get("", response_model=list[ProblemListItem])
def listProblems(
    topicId: Optional[str] = Query(default=None),
    difficulty: Optional[str] = Query(default=None),
    search: Optional[str] = Query(default=None),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
):
    supabaseClient = getSupabaseClient()
    query = (
        supabaseClient
        .table("problem_versions")
        .select("id, problem_id, title, summary, difficulty, topic_id, sourcedataset, externalid")
        .eq("is_published", True)
        .range(offset, offset + limit - 1)
    )

    if topicId:
        query = query.eq("topic_id", topicId)
    if difficulty:
        query = query.eq("difficulty", difficulty)
    if search:
        query = query.ilike("title", f"%{search}%")

    response = query.execute()
    items = response.data or []

    return [
        ProblemListItem(
            problemId=item["problem_id"],
            problemVersionId=item["id"],
            title=item["title"],
            summary=item.get("summary"),
            difficulty=item.get("difficulty"),
            topicId=item.get("topic_id"),
            sourceDataset=item.get("sourcedataset"),
            externalId=item.get("externalid"),
        )
        for item in items
    ]


@router.get("/{problemId}", response_model=ProblemDetailResponse)
def getProblem(problemId: str):
    supabaseClient = getSupabaseClient()
    response = (
        supabaseClient
        .table("problem_versions")
        .select(
            "id, problem_id, title, summary, statement_md, difficulty, topic_id, "
            "examples, constraints, inputspec, outputspec, timelimitms, memorylimitmb, "
            "allowedlanguages, sourcedataset, externalid, tests_object_key"
        )
        .eq("problem_id", problemId)
        .eq("is_published", True)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    items = response.data or []
    if not items:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")

    item = items[0]
    return ProblemDetailResponse(
        problemId=item["problem_id"],
        problemVersionId=item["id"],
        title=item["title"],
        summary=item.get("summary"),
        statementMarkdown=item.get("statement_md"),
        difficulty=item.get("difficulty"),
        topicId=item.get("topic_id"),
        examples=item.get("examples"),
        constraints=item.get("constraints"),
        inputSpec=item.get("inputspec"),
        outputSpec=item.get("outputspec"),
        timeLimitMs=item.get("timelimitms"),
        memoryLimitMb=item.get("memorylimitmb"),
        allowedLanguages=item.get("allowedlanguages"),
        sourceDataset=item.get("sourcedataset"),
        externalId=item.get("externalid"),
        testsObjectKey=item.get("tests_object_key"),
    )


@router.post("/{problemId}/run", response_model=ProblemRunResponse)
def runProblem(
    problemId: str,
    payload: ProblemRunRequest,
    authorization: str | None = Header(default=None),
):
    _ = requireUser(authorization)
    supabaseClient = getSupabaseClient()
    problemVersion = getPublishedProblemVersion(supabaseClient, problemId)
    languageConfig = ensureLanguageIsAllowed(payload.languageKey, problemVersion.get("allowedlanguages"))

    if getProviderMode() != "judge0":
        raiseExecutionUnavailable(languageConfig.languageKey)

    raiseExecutionUnavailable(languageConfig.languageKey)


@router.post("/{problemId}/submit", response_model=ProblemSubmitResponse)
def submitProblem(
    problemId: str,
    payload: ProblemSubmitRequest,
    authorization: str | None = Header(default=None),
):
    _ = requireUser(authorization)
    supabaseClient = getSupabaseClient()
    problemVersion = getPublishedProblemVersion(supabaseClient, problemId)
    languageConfig = ensureLanguageIsAllowed(payload.languageKey, problemVersion.get("allowedlanguages"))

    if getProviderMode() != "judge0":
        raiseExecutionUnavailable(languageConfig.languageKey)

    raiseExecutionUnavailable(languageConfig.languageKey)
