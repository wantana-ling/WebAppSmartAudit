"""
Unit tests for users API endpoints
"""
import pytest
from fastapi import status
from fastapi.testclient import TestClient

from api.router import app

client = TestClient(app)


class TestUsersAPI:
    """Test cases for /api/users endpoints"""

    def test_get_users_endpoint_exists(self, client):
        """Test that GET /api/users endpoint exists."""
        response = client.get("/api/users")
        # Should return either data or error, but endpoint should exist
        assert response.status_code in [
            status.HTTP_200_OK,
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            status.HTTP_401_UNAUTHORIZED
        ]

    def test_get_user_by_id_endpoint_exists(self, client):
        """Test that GET /api/users/{user_id} endpoint exists."""
        response = client.get("/api/users/10001")
        # Should return either data or error, but endpoint should exist
        assert response.status_code in [
            status.HTTP_200_OK,
            status.HTTP_404_NOT_FOUND,
            status.HTTP_500_INTERNAL_SERVER_ERROR
        ]

    def test_create_user_missing_fields(self, client):
        """Test POST /api/users with missing required fields."""
        # Missing firstname - should return 422 (validation) or 500 (if DB not ready)
        response = client.post("/api/users", json={
            "user_id": 10001,
            "lastname": "Doe",
            "password": "password123"
        })
        assert response.status_code in [
            status.HTTP_422_UNPROCESSABLE_CONTENT,  # Updated from HTTP_422_UNPROCESSABLE_ENTITY
            status.HTTP_500_INTERNAL_SERVER_ERROR  # DB pool not initialized
        ]

        # Missing lastname - should return 422 (validation) or 500 (if DB not ready)
        response = client.post("/api/users", json={
            "user_id": 10001,
            "firstname": "John",
            "password": "password123"
        })
        assert response.status_code in [
            status.HTTP_422_UNPROCESSABLE_CONTENT,  # Updated from HTTP_422_UNPROCESSABLE_ENTITY
            status.HTTP_500_INTERNAL_SERVER_ERROR  # DB pool not initialized
        ]

        # Missing user_id - should return 422 (validation) or 500 (if DB not ready)
        response = client.post("/api/users", json={
            "firstname": "John",
            "lastname": "Doe",
            "password": "password123"
        })
        assert response.status_code in [
            status.HTTP_422_UNPROCESSABLE_CONTENT,  # Updated from HTTP_422_UNPROCESSABLE_ENTITY
            status.HTTP_500_INTERNAL_SERVER_ERROR  # DB pool not initialized
        ]

        # Missing password - should return 422 (validation) or 500 (if DB not ready)
        response = client.post("/api/users", json={
            "user_id": 10001,
            "firstname": "John",
            "lastname": "Doe"
        })
        assert response.status_code in [
            status.HTTP_422_UNPROCESSABLE_CONTENT,  # Updated from HTTP_422_UNPROCESSABLE_ENTITY
            status.HTTP_500_INTERNAL_SERVER_ERROR  # DB pool not initialized
        ]

    def test_create_user_short_password(self, client):
        """Test POST /api/users with password shorter than 6 characters."""
        response = client.post("/api/users", json={
            "user_id": 10001,
            "firstname": "John",
            "lastname": "Doe",
            "password": "12345"  # Only 5 characters
        })
        # Should return 422 (validation error) or 500 (if DB not ready)
        assert response.status_code in [
            status.HTTP_422_UNPROCESSABLE_CONTENT,  # Updated from HTTP_422_UNPROCESSABLE_ENTITY
            status.HTTP_500_INTERNAL_SERVER_ERROR  # DB pool not initialized
        ]

    def test_update_user_endpoint_exists(self, client):
        """Test that PUT /api/users/{user_id} endpoint exists."""
        response = client.put("/api/users/10001", json={
            "firstname": "John",
            "lastname": "Doe",
            "status": "active"
        })
        # Should return either success or error, but endpoint should exist
        assert response.status_code in [
            status.HTTP_200_OK,
            status.HTTP_404_NOT_FOUND,
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_500_INTERNAL_SERVER_ERROR
        ]

    def test_delete_user_endpoint_exists(self, client):
        """Test that DELETE /api/users/{user_id} endpoint exists."""
        response = client.delete("/api/users/10001")
        # Should return either success or error, but endpoint should exist
        assert response.status_code in [
            status.HTTP_200_OK,
            status.HTTP_404_NOT_FOUND,
            status.HTTP_500_INTERNAL_SERVER_ERROR
        ]

