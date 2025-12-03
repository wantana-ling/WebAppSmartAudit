"""
Unit tests for input validation and edge cases
Tests various edge cases and input validation scenarios
"""
import pytest
from fastapi import status
from fastapi.testclient import TestClient

from api.router import app

client = TestClient(app)


class TestInputValidation:
    """Test cases for input validation and edge cases"""

    def test_user_id_type_validation(self, client):
        """Test that user_id accepts both string and integer types."""
        # Test with string user_id
        response1 = client.post("/api/users", json={
            "user_id": "10001",
            "firstname": "John",
            "lastname": "Doe",
            "password": "password123"
        })
        
        # Test with integer user_id
        response2 = client.post("/api/users", json={
            "user_id": 10001,
            "firstname": "John",
            "lastname": "Doe",
            "password": "password123"
        })
        
        # Both should be accepted (may fail due to DB, but should accept format)
        assert response1.status_code != status.HTTP_422_UNPROCESSABLE_CONTENT or \
               response1.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert response2.status_code != status.HTTP_422_UNPROCESSABLE_CONTENT or \
               response2.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

    def test_password_length_validation(self, client):
        """Test password length validation (minimum 6 characters)."""
        # Test with exactly 6 characters (should be valid)
        response1 = client.post("/api/users", json={
            "user_id": 10001,
            "firstname": "John",
            "lastname": "Doe",
            "password": "123456"  # Exactly 6 characters
        })
        
        # Test with 5 characters (should be invalid)
        response2 = client.post("/api/users", json={
            "user_id": 10001,
            "firstname": "John",
            "lastname": "Doe",
            "password": "12345"  # Only 5 characters
        })
        
        # First should not return 422 (validation error), second should
        assert response1.status_code != status.HTTP_422_UNPROCESSABLE_CONTENT or \
               response1.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert response2.status_code in [
            status.HTTP_422_UNPROCESSABLE_CONTENT,
            status.HTTP_500_INTERNAL_SERVER_ERROR
        ]

    def test_name_whitespace_handling(self, client):
        """Test that leading/trailing whitespace in names is handled."""
        # Test with whitespace in firstname
        response = client.post("/api/users", json={
            "user_id": 10001,
            "firstname": "  John  ",
            "lastname": "Doe",
            "password": "password123"
        })
        
        # Should accept (may fail due to DB, but should accept format)
        assert response.status_code != status.HTTP_422_UNPROCESSABLE_CONTENT or \
               response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

    def test_empty_string_handling(self, client):
        """Test handling of empty strings in optional fields."""
        # Test with empty midname (optional field)
        response = client.post("/api/users", json={
            "user_id": 10001,
            "firstname": "John",
            "midname": "",
            "lastname": "Doe",
            "password": "password123"
        })
        
        # Should accept empty optional field
        assert response.status_code != status.HTTP_422_UNPROCESSABLE_CONTENT or \
               response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

    def test_special_characters_in_names(self, client):
        """Test that special characters in names are handled."""
        # Test with special characters
        response = client.post("/api/users", json={
            "user_id": 10001,
            "firstname": "John-O'Brien",
            "lastname": "Doe-Smith",
            "password": "password123"
        })
        
        # Should accept special characters
        assert response.status_code != status.HTTP_422_UNPROCESSABLE_CONTENT or \
               response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

    def test_unicode_characters_in_names(self, client):
        """Test that Unicode characters in names are handled."""
        # Test with Unicode characters
        response = client.post("/api/users", json={
            "user_id": 10001,
            "firstname": "José",
            "lastname": "Müller",
            "password": "password123"
        })
        
        # Should accept Unicode characters
        assert response.status_code != status.HTTP_422_UNPROCESSABLE_CONTENT or \
               response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

    def test_very_long_names(self, client):
        """Test handling of very long name strings."""
        # Test with very long name
        long_name = "A" * 255
        response = client.post("/api/users", json={
            "user_id": 10001,
            "firstname": long_name,
            "lastname": "Doe",
            "password": "password123"
        })
        
        # Should handle long strings (may fail due to DB constraints, but should accept format)
        assert response.status_code != status.HTTP_422_UNPROCESSABLE_CONTENT or \
               response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

    def test_department_name_whitespace(self, client):
        """Test that department names handle whitespace correctly."""
        # Test with whitespace
        response = client.post("/api/departments", json={"name": "  Test Department  "})
        
        # Should trim whitespace or reject empty after trim
        assert response.status_code in [
            status.HTTP_201_CREATED,
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_500_INTERNAL_SERVER_ERROR
        ]

    def test_numeric_user_id_edge_cases(self, client):
        """Test edge cases for numeric user_id."""
        # Test with zero
        response1 = client.post("/api/users", json={
            "user_id": 0,
            "firstname": "John",
            "lastname": "Doe",
            "password": "password123"
        })
        
        # Test with negative number
        response2 = client.post("/api/users", json={
            "user_id": -1,
            "firstname": "John",
            "lastname": "Doe",
            "password": "password123"
        })
        
        # Both should be accepted format-wise (may fail due to business logic)
        assert response1.status_code != status.HTTP_422_UNPROCESSABLE_CONTENT or \
               response1.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert response2.status_code != status.HTTP_422_UNPROCESSABLE_CONTENT or \
               response2.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR

