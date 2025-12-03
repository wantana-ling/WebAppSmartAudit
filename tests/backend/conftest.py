"""
Pytest configuration and fixtures for backend tests
"""
import pytest
import asyncio
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock

# Import the FastAPI app
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../'))

from api.router import app


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)


@pytest.fixture
def mock_db_cursor():
    """Mock database cursor for testing."""
    cursor = AsyncMock()
    cursor.fetchone = AsyncMock(return_value=None)
    cursor.fetchall = AsyncMock(return_value=[])
    cursor.execute = AsyncMock()
    cursor.lastrowid = 1
    return cursor


@pytest.fixture
def mock_db_connection(mock_db_cursor):
    """Mock database connection."""
    connection = AsyncMock()
    connection.cursor = AsyncMock(return_value=mock_db_cursor)
    connection.__aenter__ = AsyncMock(return_value=connection)
    connection.__aexit__ = AsyncMock(return_value=None)
    return connection


@pytest.fixture
def sample_user_data():
    """Sample user data for testing."""
    return {
        "user_id": 10001,
        "firstname": "John",
        "midname": "",
        "lastname": "Doe",
        "department_id": 1,
        "status": "active"
    }


@pytest.fixture
def sample_admin_data():
    """Sample admin data for testing."""
    return {
        "user_id": "admin",
        "company": "Test Company",
        "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5"  # hashed password
    }


@pytest.fixture
def sample_department_data():
    """Sample department data for testing."""
    return {
        "id": 1,
        "department_name": "IT Department"
    }


@pytest.fixture
def sample_device_data():
    """Sample device data for testing."""
    return {
        "id": 1,
        "device_name": "Test Server",
        "ip": "192.168.1.100",
        "department": "IT Department",
        "max_users": 10
    }

