import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteExpense_overBudgetNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('deletes an expense successfully', async () => {
  fetchMock.delete('/api/expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense deleted successfully!')).toBeInTheDocument();
}, 10000);

test('fails to delete an expense', async () => {
  fetchMock.delete('/api/expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error deleting expense.')).toBeInTheDocument();
}, 10000);

test('Success: Notify when an expense exceeds the budget for a category.', async () => {
  fetchMock.get('/api/check-expense-exceed', { status: 200, body: { exceeds: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('check-expense-exceed-btn'));
  });

  expect(fetchMock.calls('/api/check-expense-exceed').length).toBe(1);
  expect(screen.getByText('Expense exceeds budget!')).toBeInTheDocument();
}, 10000);

test('Failure: Notify when an expense exceeds the budget for a category.', async () => {
  fetchMock.get('/api/check-expense-exceed', { status: 200, body: { exceeds: false } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('check-expense-exceed-btn'));
  });

  expect(fetchMock.calls('/api/check-expense-exceed').length).toBe(1);
  expect(screen.getByText('Expense does not exceed budget.')).toBeInTheDocument();
}, 10000);