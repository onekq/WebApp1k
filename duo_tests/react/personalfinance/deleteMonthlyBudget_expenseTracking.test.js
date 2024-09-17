import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteMonthlyBudget_expenseTracking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: Delete a monthly budget.', async () => {
  fetchMock.delete('/api/delete-budget', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Groceries' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-budget-btn'));
  });

  expect(fetchMock.calls('/api/delete-budget').length).toBe(1);
  expect(screen.getByText('Budget deleted successfully!')).toBeInTheDocument();
}, 10000);

test('Failure: Delete a monthly budget.', async () => {
  fetchMock.delete('/api/delete-budget', { status: 400, body: { error: 'Budget not found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Groceries' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-budget-btn'));
  });

  expect(fetchMock.calls('/api/delete-budget').length).toBe(1);
  expect(screen.getByText('Budget not found')).toBeInTheDocument();
}, 10000);

test('Success: Track expenses by payment method.', async () => {
  fetchMock.get('/api/track-expense-by-method', { status: 200, body: { success: true, result: 'Credit: 400, Cash: 300' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('track-expense-method-btn'));
  });

  expect(fetchMock.calls('/api/track-expense-by-method').length).toBe(1);
  expect(screen.getByText('Tracking result: Credit: 400, Cash: 300')).toBeInTheDocument();
}, 10000);

test('Failure: Track expenses by payment method.', async () => {
  fetchMock.get('/api/track-expense-by-method', { status: 500, body: { error: 'Tracking error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('track-expense-method-btn'));
  });

  expect(fetchMock.calls('/api/track-expense-by-method').length).toBe(1);
  expect(screen.getByText('Tracking error')).toBeInTheDocument();
}, 10000);