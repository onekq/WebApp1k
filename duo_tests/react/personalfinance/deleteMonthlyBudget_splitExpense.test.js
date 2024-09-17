import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteMonthlyBudget_splitExpense';

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

test('splits an expense into multiple categories successfully', async () => {
  fetchMock.post('/api/split-expense', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('split-expense-input'), { target: { value: '150' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-split-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense split successfully!')).toBeInTheDocument();
}, 10000);

test('fails to split an expense into multiple categories', async () => {
  fetchMock.post('/api/split-expense', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('split-expense-input'), { target: { value: '150' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-split-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error splitting expense.')).toBeInTheDocument();
}, 10000);