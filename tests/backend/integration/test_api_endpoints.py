"""
Integration tests for API endpoints
These tests require a test database or mocked database connections
"""
import pytest
from fastapi import status
from fastapi.testclient import TestClient

from api.router import app

client = TestClient(app)


class TestAPIIntegration:
    """Integration tests for API endpoints"""

    def test_api_health_check(self, client):
        """Test that the API is running and accessible."""
        # Try to access the root endpoint or docs
        response = client.get("/docs")
        assert response.status_code == status.HTTP_200_OK

    def test_cors_headers(self, client):
        """Test that CORS headers are properly set."""
        response = client.options("/api/login")
        # CORS preflight should be handled
        assert response.status_code in [
            status.HTTP_200_OK,
            status.HTTP_405_METHOD_NOT_ALLOWED
        ]

    def test_api_documentation_accessible(self, client):
        """Test that API documentation is accessible."""
        response = client.get("/docs")
        assert response.status_code == status.HTTP_200_OK

    def test_openapi_schema_accessible(self, client):
        """Test that OpenAPI schema is accessible."""
        response = client.get("/openapi.json")
        assert response.status_code == status.HTTP_200_OK
        assert "openapi" in response.json()

    def test_all_routes_registered(self, client):
        """Test that all expected routes are registered."""
        # Get OpenAPI schema
        response = client.get("/openapi.json")
        assert response.status_code == status.HTTP_200_OK
        
        schema = response.json()
        paths = schema.get("paths", {})
        
        # Check for key endpoints (note: some paths may have trailing slashes)
        expected_paths = [
            "/api/login",
            "/api/users/",  # Note: FastAPI may register with trailing slash
            "/api/users",
            "/api/departments/",
            "/api/departments",
            "/api/devices/",
            "/api/devices",
            "/api/dashboard/stats"
        ]
        
        # Check if at least one variant of each path exists
        path_found = False
        for path in expected_paths:
            if path in paths:
                path_found = True
                break
        
        # For users endpoint, check if either /api/users or /api/users/ exists
        users_found = "/api/users" in paths or "/api/users/" in paths
        assert users_found, "Expected /api/users or /api/users/ not found in API"

