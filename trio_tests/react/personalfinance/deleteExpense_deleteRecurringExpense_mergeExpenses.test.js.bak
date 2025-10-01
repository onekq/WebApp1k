import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteExpense_deleteRecurringExpense_mergeExpenses';

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

test('deletes a recurring expense successfully', async () => {
  fetchMock.delete('/api/recurring-expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recurring expense deleted successfully!')).toBeInTheDocument();
}, 10000);

test('fails to delete a recurring expense', async () => {
  fetchMock.delete('/api/recurring-expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error deleting recurring expense.')).toBeInTheDocument();
}, 10000);

test('merges multiple expenses into one successfully', async () => {
  fetchMock.post('/api/merge-expense', { success: true });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('merge-expense-input-1'), { target: { value: '300' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-merge-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expenses merged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to merge multiple expenses into one', async () => {
  fetchMock.post('/api/merge-expense', { success: false });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('merge-expense-input-1'), { target: { value: '300' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-merge-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error merging expenses.')).toBeInTheDocument();
}, 10000);
