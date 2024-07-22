import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ExpenseManager from './deleteExpense';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('deletes an expense successfully', async () => {
  fetchMock.delete('/api/expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense deleted successfully!')).toBeInTheDocument();
}, 10000);

test('fails to delete an expense', async () => {
  fetchMock.delete('/api/expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error deleting expense.')).toBeInTheDocument();
}, 10000);

