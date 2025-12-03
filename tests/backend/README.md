# Backend Tests

This directory contains all backend API tests using pytest.

## Structure

- `unit/` - Unit tests for individual modules and functions
- `integration/` - Integration tests for API endpoints
- `fixtures/` - Test fixtures and sample data

## Running Tests

```bash
# Install test dependencies
pip install -r requirements-test.txt

# Run all tests
pytest tests/backend/

# Run only unit tests
pytest tests/backend/unit/

# Run only integration tests
pytest tests/backend/integration/

# Run with coverage
pytest tests/backend/ --cov=api --cov-report=html

# Run specific test file
pytest tests/backend/unit/test_login.py

# Run with verbose output
pytest tests/backend/ -v
```

## Writing Tests

### Example Unit Test

```python
import pytest
from fastapi.testclient import TestClient
from api.router import app

client = TestClient(app)

def test_endpoint():
    response = client.get("/api/users")
    assert response.status_code == 200
```

### Example Integration Test

```python
@pytest.mark.integration
def test_full_workflow(client):
    # Test complete user flow
    pass
```

