from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


class FakeResponse:
    def __init__(self, dataValue):
        self.data = dataValue


class FakeQuery:
    def __init__(self, dataValue):
        self.dataValue = dataValue

    def select(self, fieldsValue):
        _ = fieldsValue
        return self

    def eq(self, fieldValue, fieldFilterValue):
        _ = fieldValue
        _ = fieldFilterValue
        return self

    def order(self, fieldValue, desc=False):
        _ = fieldValue
        _ = desc
        return self

    def limit(self, limitValue):
        _ = limitValue
        return self

    def execute(self):
        return FakeResponse(self.dataValue)


class FakeSupabaseClient:
    def __init__(self, problemRows):
        self.problemRows = problemRows

    def table(self, tableName):
        if tableName == "problem_versions":
            return FakeQuery(self.problemRows)
        raise AssertionError(f"Unexpected table: {tableName}")


def testExecutionLanguagesUsesRegistry(monkeypatch):
    monkeypatch.setenv("EXECUTION_PROVIDER_MODE", "disabled")
    monkeypatch.setenv("EXECUTION_ENABLED_LANGUAGES", "python")

    response = client.get("/execution/languages")

    assert response.status_code == 200
    data = response.json()
    assert data["providerMode"] == "disabled"
    languageMap = {item["languageKey"]: item for item in data["languages"]}
    assert languageMap["python"]["isEnabled"] is True
    assert languageMap["javascript"]["isEnabled"] is False


def testRunProblemReturnsProviderUnavailable(monkeypatch):
    monkeypatch.setenv("EXECUTION_PROVIDER_MODE", "disabled")
    monkeypatch.setenv("EXECUTION_ENABLED_LANGUAGES", "python")

    from backend.routers import problems

    monkeypatch.setattr(
        problems,
        "getSupabaseClient",
        lambda: FakeSupabaseClient(
            [
                {
                    "id": "version1",
                    "problem_id": "problem1",
                    "allowedlanguages": ["python"],
                }
            ]
        ),
    )

    response = client.post(
        "/problems/problem1/run",
        headers={"Authorization": "Bearer test-user"},
        json={"languageKey": "python", "sourceCode": "print(1)", "stdin": ""},
    )

    assert response.status_code == 503
    detail = response.json()["detail"]
    assert detail["code"] == "execution_provider_unavailable"
    assert detail["languageKey"] == "python"


def testRunProblemRejectsDisabledLanguage(monkeypatch):
    monkeypatch.setenv("EXECUTION_PROVIDER_MODE", "disabled")
    monkeypatch.setenv("EXECUTION_ENABLED_LANGUAGES", "python")

    from backend.routers import problems

    monkeypatch.setattr(
        problems,
        "getSupabaseClient",
        lambda: FakeSupabaseClient(
            [
                {
                    "id": "version1",
                    "problem_id": "problem1",
                    "allowedlanguages": ["javascript", "python"],
                }
            ]
        ),
    )

    response = client.post(
        "/problems/problem1/run",
        headers={"Authorization": "Bearer test-user"},
        json={"languageKey": "javascript", "sourceCode": "console.log(1)", "stdin": ""},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Language is disabled"


def testSubmitProblemReturnsProviderUnavailable(monkeypatch):
    monkeypatch.setenv("EXECUTION_PROVIDER_MODE", "disabled")
    monkeypatch.setenv("EXECUTION_ENABLED_LANGUAGES", "python")

    from backend.routers import problems

    monkeypatch.setattr(
        problems,
        "getSupabaseClient",
        lambda: FakeSupabaseClient(
            [
                {
                    "id": "version1",
                    "problem_id": "problem1",
                    "allowedlanguages": ["python"],
                }
            ]
        ),
    )

    response = client.post(
        "/problems/problem1/submit",
        headers={"Authorization": "Bearer test-user"},
        json={"languageKey": "python", "sourceCode": "print(1)", "stdin": ""},
    )

    assert response.status_code == 503
    detail = response.json()["detail"]
    assert detail["code"] == "execution_provider_unavailable"
