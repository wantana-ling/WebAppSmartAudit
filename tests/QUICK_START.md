# Quick Start Guide for Testing

## Backend Testing Setup

### 1. Install Dependencies
```bash
pip install -r requirements-test.txt
```

### 2. Run Tests
```bash
# Run all backend tests
pytest tests/backend/

# Run with coverage report
pytest tests/backend/ --cov=api --cov-report=html

# View coverage report
open htmlcov/index.html  # macOS
# or
xdg-open htmlcov/index.html  # Linux
```

### 3. Run Specific Tests
```bash
# Run only unit tests
pytest tests/backend/unit/

# Run only integration tests
pytest tests/backend/integration/

# Run specific test file
pytest tests/backend/unit/test_login.py

# Run specific test function
pytest tests/backend/unit/test_login.py::TestLogin::test_login_missing_credentials
```

## Frontend Testing Setup

### 1. Install Dependencies (if not already installed)
```bash
cd client
npm install
```

### 2. Run Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode (for development)
npm test -- --watch

# Run once (for CI)
npm test -- --watchAll=false
```

### 3. Run Specific Tests
```bash
# Run specific test file
npm test -- AlertModal.test.jsx

# Run tests matching pattern
npm test -- --testNamePattern="Login"
```

## Test Structure

### Backend Tests
```
tests/backend/
├── unit/              # Unit tests (fast, isolated)
│   ├── test_login.py
│   └── test_users.py
├── integration/       # Integration tests (slower, with dependencies)
│   └── test_api_endpoints.py
└── fixtures/          # Test data and mocks
    └── sample_data.py
```

### Frontend Tests
```
tests/frontend/
├── components/        # Component tests
│   └── AlertModal.test.jsx
├── pages/            # Page tests
│   └── Login.test.jsx
└── utils/            # Utility tests
    └── api.test.js
```

## Writing New Tests

### Backend Test Example
```python
# tests/backend/unit/test_new_feature.py
import pytest
from fastapi.testclient import TestClient
from api.router import app

client = TestClient(app)

def test_new_endpoint(client):
    response = client.get("/api/new-endpoint")
    assert response.status_code == 200
```

### Frontend Test Example
```javascript
// tests/frontend/components/NewComponent.test.jsx
import { render, screen } from '@testing-library/react';
import NewComponent from '../../../client/src/components/NewComponent';

test('renders component', () => {
  render(<NewComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

## Best Practices

1. **Write tests before fixing bugs** - Helps prevent regression
2. **Keep tests isolated** - Each test should be independent
3. **Use descriptive test names** - Clear what is being tested
4. **Test edge cases** - Empty inputs, null values, etc.
5. **Mock external dependencies** - Database, API calls, etc.
6. **Maintain test coverage** - Aim for >80% coverage

## Common Issues

### Backend Tests
- **Database connection errors**: Use mocks or test database
- **Import errors**: Check PYTHONPATH and sys.path
- **Async issues**: Use pytest-asyncio fixtures

### Frontend Tests
- **Module not found**: Check import paths
- **Router errors**: Wrap components in BrowserRouter
- **Async updates**: Use waitFor() for async operations

