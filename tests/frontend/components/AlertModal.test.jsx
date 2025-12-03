/**
 * Tests for AlertModal component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertModal from '../../../client/src/components/AlertModal';

describe('AlertModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    type: 'info',
    title: 'Test Title',
    message: 'Test Message'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders when isOpen is true', () => {
    render(<AlertModal {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(<AlertModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<AlertModal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when OK button is clicked', () => {
    const onClose = jest.fn();
    render(<AlertModal {...defaultProps} onClose={onClose} />);
    
    const okButton = screen.getByText('OK');
    fireEvent.click(okButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn();
    render(<AlertModal {...defaultProps} onClose={onClose} />);
    
    const backdrop = screen.getByText('Test Title').closest('div').parentElement;
    fireEvent.click(backdrop);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('renders success type correctly', () => {
    render(<AlertModal {...defaultProps} type="success" />);
    const modal = screen.getByText('Test Title').closest('div');
    expect(modal).toBeInTheDocument();
  });

  test('renders error type correctly', () => {
    render(<AlertModal {...defaultProps} type="error" />);
    const modal = screen.getByText('Test Title').closest('div');
    expect(modal).toBeInTheDocument();
  });

  test('renders warning type correctly', () => {
    render(<AlertModal {...defaultProps} type="warning" />);
    const modal = screen.getByText('Test Title').closest('div');
    expect(modal).toBeInTheDocument();
  });

  test('renders info type correctly', () => {
    render(<AlertModal {...defaultProps} type="info" />);
    const modal = screen.getByText('Test Title').closest('div');
    expect(modal).toBeInTheDocument();
  });

  test('renders without title', () => {
    render(<AlertModal {...defaultProps} title={null} />);
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });
});

