# Frontend Tests

This directory contains all frontend React component tests using Jest and React Testing Library.

## Structure

- `components/` - Component tests
- `pages/` - Page component tests
- `utils/` - Utility function tests

## Running Tests

```bash
# Navigate to client directory
cd client

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- AlertModal.test.jsx

# Run tests once (CI mode)
npm test -- --watchAll=false
```

## Writing Tests

### Example Component Test

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from '../../client/src/components/MyComponent';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Example Page Test

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../client/src/pages/login';

test('renders login form', () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
});
```

