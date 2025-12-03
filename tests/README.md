# Testing Documentation

This directory contains all test files for the SmartAudit application.

## Structure

```
tests/
├── backend/          # API Backend Tests (FastAPI)
│   ├── unit/         # Unit tests for individual modules
│   ├── integration/  # Integration tests for API endpoints
│   └── fixtures/     # Test fixtures and mock data
├── frontend/         # Frontend Tests (React)
│   ├── components/   # Component tests
│   ├── pages/        # Page tests
│   └── utils/        # Utility function tests
└── e2e/              # End-to-end tests (optional)
```

## Running Tests

### Backend Tests
```bash
# Run all backend tests
cd /path/to/WebAppSmartAudit
pytest tests/backend/

# Run with coverage
pytest tests/backend/ --cov=api --cov-report=html

# Run specific test file
pytest tests/backend/unit/test_users.py

# Run with verbose output
pytest tests/backend/ -v
```

### Frontend Tests
```bash
# Run all frontend tests
cd client
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- Login.test.jsx
```

## Test Types

### Backend Tests
- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test API endpoints with database
- **Fixtures**: Reusable test data and database setup

### Frontend Tests
- **Component Tests**: Test React components in isolation
- **Page Tests**: Test full page components
- **Integration Tests**: Test component interactions
- **Utils Tests**: Test utility functions

## Writing Tests

### Backend Test Example
```python
import pytest
from fastapi.testclient import TestClient
from api.router import app

client = TestClient(app)

def test_login_success():
    response = client.post("/api/login", json={
        "user_id": "admin",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "admin_info" in response.json()
```

### Frontend Test Example
```javascript
import { render, screen } from '@testing-library/react';
import Login from '../pages/login';

test('renders login form', () => {
  render(<Login />);
  const usernameInput = screen.getByPlaceholderText(/username/i);
  expect(usernameInput).toBeInTheDocument();
});
```

