from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, Header, HTTPException, status

from backend.core.auth import requireUser
from backend.database.supabaseClient import getSupabaseClient
from backend.database.userProfiles import getOrCreateUserProfileId
from backend.models.schemas import (
    RoadmapTopicResponse,
    RoadmapStartRequest,
    RoadmapStartResponse,
    RoadmapListItem,
    RoadmapResponse,
    RoadmapNodeResponse,
    RoadmapEdgeResponse,
    RoadmapProgressRequest,
)

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])


def difficultyRank(difficulty: Optional[str]) -> int:
    mapping = {"easy": 0, "medium": 1, "hard": 2}
    return mapping.get((difficulty or "medium").lower(), 1)


def computeSkipCount(hiddenSkillLevel: float, totalNodes: int) -> int:
    if totalNodes >= 8:
        if hiddenSkillLevel >= 0.85:
            return 3
        if hiddenSkillLevel >= 0.67:
            return 2
        if hiddenSkillLevel >= 0.34:
            return 1
        return 0
    if totalNodes <= 7:
        if hiddenSkillLevel >= 0.7:
            return 2
        if hiddenSkillLevel >= 0.4:
            return 1
        return 0
    return 0


def getLatestSkillLevel(supabaseClient, userId: str) -> float:
    response = (
        supabaseClient
        .table("userskillsnapshots")
        .select("hiddenskilllevel")
        .eq("userid", userId)
        .order("createdat", desc=True)
        .limit(1)
        .execute()
    )
    data = response.data or []
    if not data:
        return 0.0
    return float(data[0]["hiddenskilllevel"])


def getTopicIdBySlug(supabaseClient, slug: str) -> Optional[str]:
    response = (
        supabaseClient
        .table("topics")
        .select("id")
        .eq("slug", slug)
        .limit(1)
        .execute()
    )
    data = response.data or []
    return data[0]["id"] if data else None


@router.get("/topics", response_model=list[RoadmapTopicResponse])
def listRoadmapTopics(authorization: str | None = Header(default=None)):
    _ = requireUser(authorization)
    supabaseClient = getSupabaseClient()
    response = supabaseClient.table("topics").select("id, slug, name").order("name").execute()
    data = response.data or []
    return [
        RoadmapTopicResponse(topicId=item["id"], slug=item["slug"], name=item["name"])
        for item in data
    ]


@router.post("/start", response_model=RoadmapStartResponse)
def startRoadmap(payload: RoadmapStartRequest, authorization: str | None = Header(default=None)):
    userClaims = requireUser(authorization)
    supabaseClient = getSupabaseClient()
    profileId = getOrCreateUserProfileId(supabaseClient, userClaims["authUid"], userClaims.get("email"))

    existing = (
        supabaseClient
        .table("roadmaps")
        .select("id")
        .eq("user_id", profileId)
        .eq("topic_id", payload.topicId)
        .eq("is_active", True)
        .limit(1)
        .execute()
    )
    existingData = existing.data or []
    if existingData:
        return RoadmapStartResponse(roadmapId=existingData[0]["id"])

    topicResponse = (
        supabaseClient
        .table("topics")
        .select("name")
        .eq("id", payload.topicId)
        .limit(1)
        .execute()
    )
    topicData = topicResponse.data or []
    topicName = topicData[0]["name"] if topicData else "Topic"

    problemsResponse = (
        supabaseClient
        .table("problem_versions")
        .select("id, title, difficulty, topic_id, externalid")
        .eq("topic_id", payload.topicId)
        .eq("is_published", True)
        .execute()
    )
    problemRows = problemsResponse.data or []

    if len(problemRows) < 5:
        foundationsId = getTopicIdBySlug(supabaseClient, "foundations")
        if foundationsId:
            extraResponse = (
                supabaseClient
                .table("problem_versions")
                .select("id, title, difficulty, topic_id, externalid")
                .eq("topic_id", foundationsId)
                .eq("is_published", True)
                .execute()
            )
            problemRows.extend(extraResponse.data or [])

    if not problemRows:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No problems available for roadmap")

    problemRows.sort(
        key=lambda row: (difficultyRank(row.get("difficulty")), row.get("externalid") or "")
    )
    selectedRows = problemRows[: max(5, min(10, len(problemRows)))]

    roadmapInsert = (
        supabaseClient
        .table("roadmaps")
        .insert(
            {
                "user_id": profileId,
                "title": f"{topicName} roadmap",
                "description": "Auto-generated roadmap",
                "topic_id": payload.topicId,
                "is_active": True,
            }
        )
        .execute()
    )
    roadmapRow = roadmapInsert.data[0]
    roadmapId = roadmapRow["id"]

    nodesPayload = []
    edgesPayload = []
    for index, row in enumerate(selectedRows):
        nodesPayload.append(
            {
                "roadmap_id": roadmapId,
                "problem_version_id": row["id"],
                "node_type": "core",
                "difficulty": row.get("difficulty"),
                "position_index": (index + 1) * 10,
            }
        )

    nodeInsert = supabaseClient.table("roadmap_nodes").insert(nodesPayload).execute()
    nodeRows = nodeInsert.data or []
    nodeRows.sort(key=lambda row: row.get("position_index", 0))

    for index, node in enumerate(nodeRows[:-1]):
        edgesPayload.append(
            {
                "roadmap_id": roadmapId,
                "from_node_id": node["id"],
                "to_node_id": nodeRows[index + 1]["id"],
                "edge_type": "next",
            }
        )

    if edgesPayload:
        supabaseClient.table("roadmap_edges").insert(edgesPayload).execute()

    hiddenSkillLevel = getLatestSkillLevel(supabaseClient, profileId)
    skipCount = computeSkipCount(hiddenSkillLevel, len(nodeRows))
    progressPayload = []
    for index, node in enumerate(nodeRows):
        if index < skipCount:
            state = "skipped"
        elif index == skipCount:
            state = "available"
        else:
            state = "locked"
        progressPayload.append(
            {
                "user_id": profileId,
                "roadmap_id": roadmapId,
                "node_id": node["id"],
                "state": state,
            }
        )
    supabaseClient.table("roadmap_node_progress").insert(progressPayload).execute()

    return RoadmapStartResponse(roadmapId=roadmapId)


@router.get("", response_model=list[RoadmapListItem])
def listRoadmaps(authorization: str | None = Header(default=None)):
    userClaims = requireUser(authorization)
    supabaseClient = getSupabaseClient()
    profileId = getOrCreateUserProfileId(supabaseClient, userClaims["authUid"], userClaims.get("email"))
    response = (
        supabaseClient
        .table("roadmaps")
        .select("id, topic_id, title, is_active")
        .eq("user_id", profileId)
        .order("created_at", desc=True)
        .execute()
    )
    data = response.data or []
    return [
        RoadmapListItem(
            roadmapId=item["id"],
            topicId=item["topic_id"],
            title=item["title"],
            isActive=item.get("is_active", True),
        )
        for item in data
    ]


@router.get("/{roadmapId}", response_model=RoadmapResponse)
def getRoadmap(roadmapId: str, authorization: str | None = Header(default=None)):
    userClaims = requireUser(authorization)
    supabaseClient = getSupabaseClient()
    profileId = getOrCreateUserProfileId(supabaseClient, userClaims["authUid"], userClaims.get("email"))

    roadmapResponse = (
        supabaseClient
        .table("roadmaps")
        .select("id, topic_id, title")
        .eq("id", roadmapId)
        .eq("user_id", profileId)
        .limit(1)
        .execute()
    )
    roadmapData = roadmapResponse.data or []
    if not roadmapData:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap not found")
    roadmap = roadmapData[0]

    nodesResponse = (
        supabaseClient
        .table("roadmap_nodes")
        .select("id, problem_version_id, node_type, difficulty, position_index")
        .eq("roadmap_id", roadmapId)
        .order("position_index")
        .execute()
    )
    nodeRows = nodesResponse.data or []
    nodeIds = [node["id"] for node in nodeRows]
    problemIds = [node["problem_version_id"] for node in nodeRows]

    problemResponse = (
        supabaseClient
        .table("problem_versions")
        .select("id, title, difficulty")
        .in_("id", problemIds)
        .execute()
    )
    problemRows = problemResponse.data or []
    problemMap = {row["id"]: row for row in problemRows}

    progressResponse = (
        supabaseClient
        .table("roadmap_node_progress")
        .select("node_id, state")
        .eq("roadmap_id", roadmapId)
        .eq("user_id", profileId)
        .in_("node_id", nodeIds)
        .execute()
    )
    progressMap = {row["node_id"]: row["state"] for row in (progressResponse.data or [])}

    edgesResponse = (
        supabaseClient
        .table("roadmap_edges")
        .select("from_node_id, to_node_id, edge_type")
        .eq("roadmap_id", roadmapId)
        .execute()
    )
    edgeRows = edgesResponse.data or []

    nodes = []
    for node in nodeRows:
        problem = problemMap.get(node["problem_version_id"], {})
        nodes.append(
            RoadmapNodeResponse(
                nodeId=node["id"],
                problemVersionId=node["problem_version_id"],
                title=problem.get("title", "Untitled"),
                difficulty=problem.get("difficulty") or node.get("difficulty"),
                nodeType=node["node_type"],
                positionIndex=node["position_index"],
                state=progressMap.get(node["id"], "locked"),
            )
        )

    edges = [
        RoadmapEdgeResponse(
            fromNodeId=edge["from_node_id"],
            toNodeId=edge["to_node_id"],
            edgeType=edge["edge_type"],
        )
        for edge in edgeRows
    ]

    return RoadmapResponse(
        roadmapId=roadmap["id"],
        topicId=roadmap["topic_id"],
        title=roadmap["title"],
        nodes=nodes,
        edges=edges,
    )


@router.post("/{roadmapId}/nodes/{nodeId}/progress")
def updateRoadmapProgress(
    roadmapId: str,
    nodeId: str,
    payload: RoadmapProgressRequest,
    authorization: str | None = Header(default=None),
):
    userClaims = requireUser(authorization)
    supabaseClient = getSupabaseClient()
    profileId = getOrCreateUserProfileId(supabaseClient, userClaims["authUid"], userClaims.get("email"))
    supabaseClient.table("roadmap_node_progress").update(
        {"state": payload.state}
    ).eq("roadmap_id", roadmapId).eq("node_id", nodeId).eq("user_id", profileId).execute()

    if payload.state == "completed":
        edgesResponse = (
            supabaseClient
            .table("roadmap_edges")
            .select("to_node_id")
            .eq("roadmap_id", roadmapId)
            .eq("from_node_id", nodeId)
            .execute()
        )
        for edge in edgesResponse.data or []:
            supabaseClient.table("roadmap_node_progress").update(
                {"state": "available"}
            ).eq("roadmap_id", roadmapId).eq("node_id", edge["to_node_id"]).eq("user_id", profileId).execute()

    return {"status": "ok"}


@router.post("/{roadmapId}/nodes/{nodeId}/branch")
def branchRoadmap(
    roadmapId: str,
    nodeId: str,
    authorization: str | None = Header(default=None),
):
    userClaims = requireUser(authorization)
    supabaseClient = getSupabaseClient()
    profileId = getOrCreateUserProfileId(supabaseClient, userClaims["authUid"], userClaims.get("email"))

    nodeResponse = (
        supabaseClient
        .table("roadmap_nodes")
        .select("id, problem_version_id, difficulty, position_index, roadmap_id")
        .eq("id", nodeId)
        .eq("roadmap_id", roadmapId)
        .limit(1)
        .execute()
    )
    nodeData = nodeResponse.data or []
    if not nodeData:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Node not found")
    currentNode = nodeData[0]

    nextEdgeResponse = (
        supabaseClient
        .table("roadmap_edges")
        .select("id, to_node_id")
        .eq("roadmap_id", roadmapId)
        .eq("from_node_id", nodeId)
        .eq("edge_type", "next")
        .limit(1)
        .execute()
    )
    nextEdgeData = nextEdgeResponse.data or []
    if not nextEdgeData:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No next node to branch to")
    nextEdge = nextEdgeData[0]
    nextNodeId = nextEdge["to_node_id"]

    existingNodesResponse = (
        supabaseClient
        .table("roadmap_nodes")
        .select("problem_version_id")
        .eq("roadmap_id", roadmapId)
        .execute()
    )
    existingProblemIds = {
        row["problem_version_id"] for row in (existingNodesResponse.data or [])
    }

    currentProblemResponse = (
        supabaseClient
        .table("problem_versions")
        .select("topic_id, difficulty")
        .eq("id", currentNode["problem_version_id"])
        .limit(1)
        .execute()
    )
    currentProblem = (currentProblemResponse.data or [{}])[0]
    topicId = currentProblem.get("topic_id")
    currentDifficulty = currentProblem.get("difficulty")

    candidatesResponse = (
        supabaseClient
        .table("problem_versions")
        .select("id, title, difficulty, topic_id, externalid")
        .eq("topic_id", topicId)
        .eq("is_published", True)
        .execute()
    )
    candidates = candidatesResponse.data or []

    filtered = [
        row
        for row in candidates
        if row["id"] not in existingProblemIds
        and difficultyRank(row.get("difficulty")) <= difficultyRank(currentDifficulty) - 1
    ]

    if not filtered:
        filtered = [
            row
            for row in candidates
            if row["id"] not in existingProblemIds
            and difficultyRank(row.get("difficulty")) <= difficultyRank(currentDifficulty)
        ]

    if not filtered:
        foundationsId = getTopicIdBySlug(supabaseClient, "foundations")
        if foundationsId:
            fallbackResponse = (
                supabaseClient
                .table("problem_versions")
                .select("id, title, difficulty, topic_id, externalid")
                .eq("topic_id", foundationsId)
                .eq("is_published", True)
                .execute()
            )
            fallback = fallbackResponse.data or []
            filtered = [row for row in fallback if row["id"] not in existingProblemIds]
    filtered.sort(key=lambda row: (difficultyRank(row.get("difficulty")), row.get("externalid") or ""))
    remedialRows = filtered[:3]
    if not remedialRows:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No remedial problems available")

    supabaseClient.table("roadmap_edges").delete().eq("id", nextEdge["id"]).execute()

    remedialPayload = []
    for index, row in enumerate(remedialRows, start=1):
        remedialPayload.append(
            {
                "roadmap_id": roadmapId,
                "problem_version_id": row["id"],
                "node_type": "remedial",
                "difficulty": row.get("difficulty"),
                "position_index": currentNode["position_index"] + index,
            }
        )
    remedialInsert = supabaseClient.table("roadmap_nodes").insert(remedialPayload).execute()
    remedialNodes = remedialInsert.data or []

    edgesPayload = [
        {
            "roadmap_id": roadmapId,
            "from_node_id": nodeId,
            "to_node_id": remedialNodes[0]["id"],
            "edge_type": "branch",
        }
    ]
    for index, remedial in enumerate(remedialNodes[:-1]):
        edgesPayload.append(
            {
                "roadmap_id": roadmapId,
                "from_node_id": remedial["id"],
                "to_node_id": remedialNodes[index + 1]["id"],
                "edge_type": "next",
            }
        )
    edgesPayload.append(
        {
            "roadmap_id": roadmapId,
            "from_node_id": remedialNodes[-1]["id"],
            "to_node_id": nextNodeId,
            "edge_type": "next",
        }
    )
    supabaseClient.table("roadmap_edges").insert(edgesPayload).execute()

    progressPayload = []
    for index, remedial in enumerate(remedialNodes):
        state = "available" if index == 0 else "locked"
        progressPayload.append(
            {
                "user_id": profileId,
                "roadmap_id": roadmapId,
                "node_id": remedial["id"],
                "state": state,
            }
        )
    supabaseClient.table("roadmap_node_progress").insert(progressPayload).execute()

    supabaseClient.table("roadmap_node_progress").update(
        {"state": "locked"}
    ).eq("roadmap_id", roadmapId).eq("node_id", nextNodeId).eq("user_id", profileId).execute()

    return {"status": "branched", "addedNodes": len(remedialNodes)}
