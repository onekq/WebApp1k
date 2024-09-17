import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateTotalExpenses_deleteExpense';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Calculates total expenses for the given period successfully', async () => {
  fetchMock.post('/api/calculate-expenses', {
    body: { total: 1000 },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-total-expenses'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-expenses-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Expenses: 1000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total expenses due to invalid period format', async () => {
  fetchMock.post('/api/calculate-expenses', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-total-expenses'), { target: { value: 'invalid-period' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-expenses-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid period format')).toBeInTheDocument();
}, 10000);

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