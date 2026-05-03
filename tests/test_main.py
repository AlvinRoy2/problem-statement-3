import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app
from app.core.security import _rate_limit_store

client = TestClient(app)

@pytest.fixture(autouse=True)
def clear_rate_limits():
    _rate_limit_store.clear()
    yield

def test_security_headers():
    response = client.get("/")
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "DENY"

@patch("app.api.chat.get_chat_response")
def test_chat_success(mock_get_chat_response):
    mock_get_chat_response.return_value = ("Test reply", "NONE", 1)
    
    response = client.post("/api/chat", json={
        "message": "Hello",
        "progress_step": 0
    })
    
    assert response.status_code == 200
    assert response.json() == {
        "reply": "Test reply",
        "action": "NONE",
        "next_step": 1
    }

@patch("app.api.chat.get_chat_response")
def test_chat_failure(mock_get_chat_response):
    mock_get_chat_response.side_effect = Exception("API Down")
    
    response = client.post("/api/chat", json={
        "message": "Hello",
        "progress_step": 0
    })
    
    assert response.status_code == 500
    assert "temporarily unavailable" in response.json()["detail"]

def test_rate_limiting():
    # Make 15 successful requests
    for _ in range(15):
        response = client.post("/api/chat", json={"message": "test"})
        assert response.status_code in [200, 500] # Depends on if Gemini is mocked or not, but won't be 429
        
    # The 16th should fail
    response = client.post("/api/chat", json={"message": "test"})
    assert response.status_code == 429
    assert "Too many requests" in response.json()["detail"]
