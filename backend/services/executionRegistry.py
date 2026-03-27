from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class ExecutionLanguageConfig:
    languageKey: str
    displayName: str
    judge0LanguageId: int
    isEnabled: bool


languageCatalog: tuple[tuple[str, str, int], ...] = (
    ("python", "Python 3", 71),
    ("javascript", "JavaScript (Node.js)", 63),
    ("java", "Java", 62),
    ("cpp", "C++", 54),
)


def getProviderMode() -> str:
    configuredMode = os.getenv("EXECUTION_PROVIDER_MODE", "disabled").strip().lower()
    if configuredMode not in {"disabled", "judge0"}:
        return "disabled"
    return configuredMode


def parseEnabledLanguageKeys() -> set[str]:
    configuredKeys = os.getenv("EXECUTION_ENABLED_LANGUAGES", "python")
    parsedKeys = {
        key.strip().lower()
        for key in configuredKeys.split(",")
        if key.strip()
    }
    if not parsedKeys:
        return {"python"}
    return parsedKeys


def getLanguageRegistry() -> list[ExecutionLanguageConfig]:
    enabledLanguageKeys = parseEnabledLanguageKeys()
    return [
        ExecutionLanguageConfig(
            languageKey=languageKey,
            displayName=displayName,
            judge0LanguageId=judge0LanguageId,
            isEnabled=languageKey in enabledLanguageKeys,
        )
        for languageKey, displayName, judge0LanguageId in languageCatalog
    ]


def getLanguageConfig(languageKey: str) -> ExecutionLanguageConfig | None:
    normalizedLanguageKey = languageKey.strip().lower()
    for languageConfig in getLanguageRegistry():
        if languageConfig.languageKey == normalizedLanguageKey:
            return languageConfig
    return None
