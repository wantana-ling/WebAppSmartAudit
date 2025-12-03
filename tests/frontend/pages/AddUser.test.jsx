/**
 * Tests for AddUser component
 * Tests form validation, submission, and error handling
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddUser from '../../../client/src/pages/addUser';
import api from '../../../client/src/api';

// Mock the API
jest.mock('../../../client/src/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('AddUser Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: [{ id: 1, department_name: 'IT' }] });
  });

  const renderAddUser = () => {
    return render(
      <BrowserRouter>
        <AddUser />
      </BrowserRouter>
    );
  };

  test('renders Add User form', () => {
    renderAddUser();
    expect(screen.getByText('Add User')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderAddUser();
    
    const submitButton = screen.getByRole('button', { name: /ADD/i });
    fireEvent.click(submitButton);

    // Form validation should prevent submission
    await waitFor(() => {
      expect(api.post).not.toHaveBeenCalled();
    });
  });

  test('validates password match', async () => {
    renderAddUser();
    
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm password/i), { target: { value: 'different' } });
    
    const submitButton = screen.getByRole('button', { name: /ADD/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).not.toHaveBeenCalled();
    });
  });

  test('validates department selection', async () => {
    renderAddUser();
    
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/UserID/i), { target: { value: '10001' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm password/i), { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: /ADD/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).not.toHaveBeenCalled();
    });
  });

  test('handles successful user creation', async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    
    renderAddUser();
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/departments');
    });

    // Fill form
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/UserID/i), { target: { value: '10001' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm password/i), { target: { value: 'password123' } });
    
    // Select department
    const deptButton = screen.getByText(/Select Department/i);
    fireEvent.click(deptButton);
    
    await waitFor(() => {
      const itDept = screen.getByText('IT');
      fireEvent.click(itDept);
    });

    const submitButton = screen.getByRole('button', { name: /ADD/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/users', expect.objectContaining({
        firstname: 'John',
        lastname: 'Doe',
        user_id: 10001,
      }));
    });
  });

  test('handles API error', async () => {
    api.post.mockRejectedValue({ 
      response: { data: { detail: 'User ID already exists' } } 
    });
    
    renderAddUser();
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/departments');
    });

    // Fill form
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/UserID/i), { target: { value: '10001' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm password/i), { target: { value: 'password123' } });
    
    // Select department
    const deptButton = screen.getByText(/Select Department/i);
    fireEvent.click(deptButton);
    
    await waitFor(() => {
      const itDept = screen.getByText('IT');
      fireEvent.click(itDept);
    });

    const submitButton = screen.getByRole('button', { name: /ADD/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });

  test('handles user_id as string', async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    
    renderAddUser();
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/api/departments');
    });

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/UserID/i), { target: { value: '0' } }); // Edge case: "0"
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm password/i), { target: { value: 'password123' } });
    
    const deptButton = screen.getByText(/Select Department/i);
    fireEvent.click(deptButton);
    
    await waitFor(() => {
      const itDept = screen.getByText('IT');
      fireEvent.click(itDept);
    });

    const submitButton = screen.getByRole('button', { name: /ADD/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });
});

