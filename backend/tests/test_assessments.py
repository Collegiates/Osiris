from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def testShortAssessmentFlow():
    headers = {"Authorization": "Bearer test-user"}
    startResponse = client.post("/assessments", json={"assessmentType": "short"}, headers=headers)
    assert startResponse.status_code == 200
    assessmentId = startResponse.json()["assessmentId"]

    getResponse = client.get(f"/assessments/{assessmentId}", headers=headers)
    assert getResponse.status_code == 200
    questions = getResponse.json()["questions"]
    assert len(questions) == 11
    codingCount = len([q for q in questions if q["questionType"] == "coding"])
    csCount = len([q for q in questions if q["questionType"] == "cs"])
    assert codingCount == 1
    assert csCount == 10

    submitResponse = client.post(
        f"/assessments/{assessmentId}/submit",
        json={"answers": {}, "timeSpentSeconds": 0},
        headers=headers,
    )
    assert submitResponse.status_code == 200
    data = submitResponse.json()
    assert data["assessmentType"] == "short"


def testNormalAssessmentFlow():
    headers = {"Authorization": "Bearer test-user-2"}
    startResponse = client.post("/assessments", json={"assessmentType": "normal"}, headers=headers)
    assert startResponse.status_code == 200
    assessmentId = startResponse.json()["assessmentId"]

    getResponse = client.get(f"/assessments/{assessmentId}", headers=headers)
    assert getResponse.status_code == 200
    questions = getResponse.json()["questions"]
    assert len(questions) == 12
    codingCount = len([q for q in questions if q["questionType"] == "coding"])
    csCount = len([q for q in questions if q["questionType"] == "cs"])
    assert codingCount == 2
    assert csCount == 10
