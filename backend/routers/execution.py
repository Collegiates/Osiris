from __future__ import annotations

from fastapi import APIRouter

from backend.models.schemas import ExecutionLanguageResponse, ExecutionLanguagesResponse
from backend.services.executionRegistry import getLanguageRegistry, getProviderMode

router = APIRouter(prefix="/execution", tags=["execution"])


@router.get("/languages", response_model=ExecutionLanguagesResponse)
def listExecutionLanguages():
    languageResponses = [
        ExecutionLanguageResponse(
            languageKey=languageConfig.languageKey,
            displayName=languageConfig.displayName,
            judge0LanguageId=languageConfig.judge0LanguageId,
            isEnabled=languageConfig.isEnabled,
        )
        for languageConfig in getLanguageRegistry()
    ]
    return ExecutionLanguagesResponse(
        providerMode=getProviderMode(),
        languages=languageResponses,
    )
