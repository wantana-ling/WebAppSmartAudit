# คู่มือการใช้งาน Tests

## 📚 สารบัญ

1. [ภาพรวม](#ภาพรวม)
2. [การติดตั้ง Dependencies](#การติดตั้ง-dependencies)
3. [การรัน Tests](#การรัน-tests)
4. [Backend Tests](#backend-tests)
5. [Frontend Tests](#frontend-tests)
6. [การอ่านผลลัพธ์ Tests](#การอ่านผลลัพธ์-tests)
7. [การเขียน Tests ใหม่](#การเขียน-tests-ใหม่)
8. [Troubleshooting](#troubleshooting)

---

## ภาพรวม

โปรเจกต์นี้มี tests สำหรับทั้ง Backend (FastAPI) และ Frontend (React) เพื่อให้มั่นใจว่าระบบทำงานได้ถูกต้องและมีคุณภาพ

### โครงสร้าง Tests

```
tests/
├── backend/              # Backend tests (Python/Pytest)
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── fixtures/        # Test data
├── frontend/            # Frontend tests (Jest/React Testing Library)
│   ├── components/      # Component tests
│   ├── pages/          # Page tests
│   └── utils/         # Utility tests
├── QUICK_START.md      # Quick start guide
├── TEST_SUMMARY.md     # Test summary
└── HOW_TO_USE_TESTS.md # This file
```

---

## การติดตั้ง Dependencies

### Backend Tests

```bash
# ติดตั้ง Python test dependencies
pip install -r requirements-test.txt
```

### Frontend Tests

```bash
# ไปที่ client directory
cd client

# ติดตั้ง dependencies (ถ้ายังไม่ได้ติดตั้ง)
npm install
```

---

## การรัน Tests

### วิธีที่ 1: ใช้ Script (แนะนำ)

```bash
# รัน tests ทั้งหมด (backend + frontend)
./run-tests.sh

# รันเฉพาะ backend tests
./run-tests.sh backend

# รันเฉพาะ frontend tests
./run-tests.sh frontend
```

### วิธีที่ 2: รันโดยตรง

#### Backend Tests

```bash
# รัน tests ทั้งหมด
pytest tests/backend/ -v

# รันเฉพาะ unit tests
pytest tests/backend/unit/ -v

# รันเฉพาะ integration tests
pytest tests/backend/integration/ -v

# รัน test file เฉพาะ
pytest tests/backend/unit/test_users.py -v

# รัน test function เฉพาะ
pytest tests/backend/unit/test_users.py::TestUsersAPI::test_get_users_endpoint_exists -v
```

#### Frontend Tests

```bash
# ไปที่ client directory
cd client

# รัน tests ทั้งหมด
npm test

# รัน tests ใน watch mode (auto-rerun เมื่อไฟล์เปลี่ยน)
npm test -- --watch

# รัน tests พร้อม coverage
npm test -- --coverage
```

---

## Backend Tests

### ประเภทของ Tests

#### 1. Unit Tests (`tests/backend/unit/`)

ทดสอบฟังก์ชันหรือ module เดียวๆ โดยแยกจาก dependencies อื่นๆ

**ตัวอย่าง:**
- `test_login.py` - ทดสอบ login endpoint
- `test_users.py` - ทดสอบ user CRUD operations
- `test_departments.py` - ทดสอบ department operations
- `test_validation.py` - ทดสอบ input validation
- `test_security.py` - ทดสอบ security scenarios

#### 2. Integration Tests (`tests/backend/integration/`)

ทดสอบการทำงานร่วมกันของหลาย components

**ตัวอย่าง:**
- `test_api_endpoints.py` - ทดสอบ API endpoints และ CORS
- `test_error_handling.py` - ทดสอบ error handling scenarios

### คำสั่งที่ใช้บ่อย

```bash
# รัน tests พร้อม coverage report
pytest tests/backend/ --cov=api --cov-report=html

# ดู coverage report
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux

# รัน tests แบบ verbose (แสดงรายละเอียด)
pytest tests/backend/ -v

# รัน tests แบบแสดง output (print statements)
pytest tests/backend/ -v -s

# รัน tests แบบ stop on first failure
pytest tests/backend/ -x

# รัน tests แบบ show local variables on failure
pytest tests/backend/ -l

# รัน tests แบบ show full traceback
pytest tests/backend/ --tb=long
```

### ตัวอย่างการอ่านผลลัพธ์

```
tests/backend/unit/test_users.py::TestUsersAPI::test_get_users_endpoint_exists PASSED [ 72%]
tests/backend/unit/test_users.py::TestUsersAPI::test_create_user_missing_fields PASSED [ 76%]
...
======================== 51 passed, 1 warning in 0.20s =========================
```

**ความหมาย:**
- `PASSED` = test ผ่าน
- `FAILED` = test ล้มเหลว
- `SKIPPED` = test ถูกข้าม
- `WARNING` = มี warnings แต่ test ยังผ่าน

---

## Frontend Tests

### ประเภทของ Tests

#### 1. Component Tests (`tests/frontend/components/`)

ทดสอบ React components

**ตัวอย่าง:**
- `AlertModal.test.jsx` - ทดสอบ AlertModal component

#### 2. Page Tests (`tests/frontend/pages/`)

ทดสอบ page components

**ตัวอย่าง:**
- `Login.test.jsx` - ทดสอบ Login page
- `AddUser.test.jsx` - ทดสอบ AddUser page

#### 3. Utility Tests (`tests/frontend/utils/`)

ทดสอบ utility functions และ constants

**ตัวอย่าง:**
- `api.test.js` - ทดสอบ API configuration
- `constants.test.js` - ทดสอบ constants

### คำสั่งที่ใช้บ่อย

```bash
cd client

# รัน tests ทั้งหมด
npm test

# รัน tests ใน watch mode
npm test -- --watch

# รัน tests พร้อม coverage
npm test -- --coverage

# รัน tests แบบ update snapshots
npm test -- -u

# รัน tests แบบ verbose
npm test -- --verbose

# รัน test file เฉพาะ
npm test -- AddUser.test.jsx
```

### ตัวอย่างการอ่านผลลัพธ์

```
PASS  tests/frontend/components/AlertModal.test.jsx
  AlertModal Component
    ✓ renders when isOpen is true
    ✓ does not render when isOpen is false
    ✓ calls onClose when close button is clicked

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

---

## การอ่านผลลัพธ์ Tests

### Backend Test Results

#### ✅ Test ผ่าน (PASSED)

```
tests/backend/unit/test_users.py::TestUsersAPI::test_get_users_endpoint_exists PASSED
```

#### ❌ Test ล้มเหลว (FAILED)

```
tests/backend/unit/test_users.py::TestUsersAPI::test_create_user FAILED

=================================== FAILURES ===================================
test_create_user: AssertionError: assert 500 == 200
```

**วิธีแก้:**
1. อ่าน error message อย่างละเอียด
2. ตรวจสอบว่า API endpoint ทำงานถูกต้องหรือไม่
3. ตรวจสอบว่า database connection พร้อมหรือไม่
4. ตรวจสอบ test logic ว่าถูกต้องหรือไม่

#### ⚠️ Warning

```
======================== 51 passed, 1 warning in 0.20s =========================
```

**ความหมาย:** Tests ผ่านทั้งหมด แต่มี warnings (เช่น deprecation warnings)

### Frontend Test Results

#### ✅ Test ผ่าน

```
✓ renders login form
✓ allows user to type in username field
```

#### ❌ Test ล้มเหลว

```
✕ shows error message on login failure

  expect(screen.getByText(/invalid/i)).toBeInTheDocument()
  
  Unable to find an element with text: /invalid/i
```

**วิธีแก้:**
1. ตรวจสอบว่า component render ถูกต้องหรือไม่
2. ตรวจสอบว่า text content ตรงกับที่คาดหวังหรือไม่
3. ตรวจสอบว่า mock functions ทำงานถูกต้องหรือไม่

---

## การเขียน Tests ใหม่

### Backend Test Template

```python
"""
Unit tests for [module name]
"""
import pytest
from fastapi import status
from fastapi.testclient import TestClient

from api.router import app

client = TestClient(app)


class TestModuleName:
    """Test cases for /api/[endpoint] endpoint"""

    def test_endpoint_exists(self, client):
        """Test that endpoint exists."""
        response = client.get("/api/endpoint")
        assert response.status_code in [
            status.HTTP_200_OK,
            status.HTTP_500_INTERNAL_SERVER_ERROR
        ]

    def test_validation(self, client):
        """Test input validation."""
        response = client.post("/api/endpoint", json={})
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT
```

### Frontend Test Template

```javascript
/**
 * Tests for [Component Name]
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentName from '../../../client/src/components/ComponentName';

describe('ComponentName Component', () => {
  test('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('handles user interaction', () => {
    render(<ComponentName />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    // Assert expected behavior
  });
});
```

### Best Practices

1. **ตั้งชื่อ test ให้ชัดเจน**
   ```python
   # ✅ ดี
   def test_create_user_with_missing_firstname_returns_422(self, client):
   
   # ❌ ไม่ดี
   def test_user(self, client):
   ```

2. **ทดสอบ behavior ไม่ใช่ implementation**
   ```python
   # ✅ ดี - ทดสอบ behavior
   assert response.status_code == 200
   
   # ❌ ไม่ดี - ทดสอบ implementation
   assert len(response.json()) == 5
   ```

3. **ใช้ descriptive assertions**
   ```python
   # ✅ ดี
   assert response.status_code == 200, "Expected successful response"
   
   # ❌ ไม่ดี
   assert response.status_code == 200
   ```

4. **แยก test cases ให้ชัดเจน**
   ```python
   # ✅ ดี - แยก test cases
   def test_missing_firstname(self, client):
   def test_missing_lastname(self, client):
   
   # ❌ ไม่ดี - รวมหลาย cases
   def test_missing_fields(self, client):
   ```

---

## Troubleshooting

### ปัญหาที่พบบ่อย

#### 1. Backend Tests: Database Connection Error

**อาการ:**
```
HTTPException: DB pool not initialized
```

**วิธีแก้:**
- Tests เหล่านี้ไม่ต้องการ database จริง
- Tests ถูกออกแบบให้ผ่านแม้ไม่มี database
- ถ้าต้องการทดสอบกับ database จริง ต้อง setup test database

#### 2. Frontend Tests: Module Not Found

**อาการ:**
```
Cannot find module '../../../client/src/api'
```

**วิธีแก้:**
- ตรวจสอบว่า path ถูกต้องหรือไม่
- ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
- รัน `npm install` ใน client directory

#### 3. Tests ผ่านแต่มี Warnings

**อาการ:**
```
======================== 51 passed, 1 warning in 0.20s =========================
```

**วิธีแก้:**
- Warnings มักไม่ใช่ปัญหาใหญ่
- ถ้าต้องการดู warnings: `pytest tests/backend/ -v -W default`
- ถ้าต้องการซ่อน warnings: `pytest tests/backend/ --disable-warnings`

#### 4. Frontend Tests: Timeout

**อาการ:**
```
Timeout - Async callback was not invoked within the 5000ms timeout
```

**วิธีแก้:**
- เพิ่ม timeout: `jest.setTimeout(10000)`
- ตรวจสอบว่า async operations เสร็จแล้วหรือไม่
- ใช้ `waitFor` สำหรับ async operations

### คำสั่ง Debug

```bash
# Backend: รัน test แบบ verbose พร้อม output
pytest tests/backend/unit/test_users.py -v -s

# Frontend: รัน test แบบ verbose
npm test -- --verbose

# Backend: รัน test แบบ show print statements
pytest tests/backend/ -v -s --capture=no

# Frontend: รัน test แบบ no cache
npm test -- --no-cache
```

---

## ตัวอย่างการใช้งานจริง

### Scenario 1: เพิ่ม Feature ใหม่

```bash
# 1. เขียน test ก่อน (TDD)
pytest tests/backend/unit/test_new_feature.py -v

# 2. Test จะ fail (เพราะยังไม่มี implementation)
# 3. เขียน implementation
# 4. รัน test อีกครั้ง
pytest tests/backend/unit/test_new_feature.py -v

# 5. Test ผ่านแล้ว!
```

### Scenario 2: แก้ Bug

```bash
# 1. เขียน test ที่ reproduce bug
pytest tests/backend/unit/test_bug.py -v

# 2. Test จะ fail (reproduce bug)
# 3. แก้ bug
# 4. รัน test อีกครั้ง
pytest tests/backend/unit/test_bug.py -v

# 5. Test ผ่านแล้ว!
```

### Scenario 3: Refactor Code

```bash
# 1. รัน tests ทั้งหมดก่อน refactor
pytest tests/backend/ -v

# 2. Refactor code
# 3. รัน tests อีกครั้ง
pytest tests/backend/ -v

# 4. ถ้า tests ผ่านทั้งหมด = refactor สำเร็จ!
```

---

## สรุป

### Checklist สำหรับการใช้งาน Tests

- [ ] ติดตั้ง dependencies แล้ว (`pip install -r requirements-test.txt`, `npm install`)
- [ ] รัน tests ทั้งหมดผ่านแล้ว (`./run-tests.sh`)
- [ ] เขียน tests สำหรับ feature ใหม่
- [ ] รัน tests ก่อน commit code
- [ ] ตรวจสอบ coverage report

### Resources เพิ่มเติม

- [Pytest Documentation](https://docs.pytest.org/)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)

---

**Happy Testing! 🚀**

