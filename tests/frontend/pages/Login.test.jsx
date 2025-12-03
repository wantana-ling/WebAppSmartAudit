/**
 * Tests for Login page component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import Login from '../../../client/src/pages/login';

// Mock axios
jest.mock('axios');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null })
}));

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  test('renders login form', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('allows user to type in username field', () => {
    renderLogin();
    const usernameInput = screen.getByPlaceholderText(/username/i);
    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    expect(usernameInput.value).toBe('admin');
  });

  test('allows user to type in password field', () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  test('toggles password visibility', () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /show|hide/i });
    
    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');
    
    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    // Click to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  test('shows error message on login failure', async () => {
    axios.post.mockRejectedValueOnce({
      response: { status: 401, data: { detail: 'Invalid credentials' } }
    });

    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    });
  });

  test('navigates to dashboard on successful login', async () => {
    const mockResponse = {
      data: {
        success: true,
        admin_info: {
          user_id: 'admin',
          company: 'Test Company'
        }
      }
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('saves admin data to localStorage on successful login', async () => {
    const mockResponse = {
      data: {
        success: true,
        admin_info: {
          user_id: 'admin',
          company: 'Test Company'
        }
      }
    };
    axios.post.mockResolvedValueOnce(mockResponse);

    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem('user_id')).toBe('admin');
      expect(localStorage.getItem('admin')).toBeTruthy();
    });
  });
});

