import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecurringExpense_exportExpenses_splitExpense';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('deletes a recurring expense successfully', async () => {
  fetchMock.delete('/api/recurring-expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recurring expense deleted successfully!')).toBeInTheDocument();
}, 10000);

test('fails to delete a recurring expense', async () => {
  fetchMock.delete('/api/recurring-expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error deleting recurring expense.')).toBeInTheDocument();
}, 10000);

test('Exports expenses to a CSV file successfully', async () => {
  fetchMock.post('/api/export-csv', {
    body: { success: true },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-csv-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export successful')).toBeInTheDocument();
}, 10000);

test('Fails to export expenses to a CSV file due to server error', async () => {
  fetchMock.post('/api/export-csv', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-csv-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export failed')).toBeInTheDocument();
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
