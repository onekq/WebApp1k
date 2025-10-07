import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecurringExpense_expenseImport_calculateTotalIncome_overExpenseNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('deletes a recurring expense successfully (from deleteRecurringExpense_expenseImport)', async () => {
  fetchMock.delete('/api/recurring-expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recurring expense deleted successfully!')).toBeInTheDocument();
}, 10000);

test('fails to delete a recurring expense (from deleteRecurringExpense_expenseImport)', async () => {
  fetchMock.delete('/api/recurring-expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error deleting recurring expense.')).toBeInTheDocument();
}, 10000);

test('Success: Import expenses from a CSV file. (from deleteRecurringExpense_expenseImport)', async () => {
  fetchMock.post('/api/import-csv', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  const fileInput = screen.getByTestId('csv-file-input');
  const file = new File(['content'], 'expenses.csv', { type: 'text/csv' });

  await act(async () => {
    fireEvent.change(fileInput, { target: { files: [file] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('import-csv-btn'));
  });

  expect(fetchMock.calls('/api/import-csv').length).toBe(1);
  expect(screen.getByText('CSV imported successfully!')).toBeInTheDocument();
}, 10000);

test('Failure: Import expenses from a CSV file. (from deleteRecurringExpense_expenseImport)', async () => {
  fetchMock.post('/api/import-csv', { status: 400, body: { error: 'Invalid CSV file' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  const fileInput = screen.getByTestId('csv-file-input');
  const file = new File(['content'], 'expenses.csv', { type: 'text/csv' });

  await act(async () => {
    fireEvent.change(fileInput, { target: { files: [file] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('import-csv-btn'));
  });

  expect(fetchMock.calls('/api/import-csv').length).toBe(1);
  expect(screen.getByText('Invalid CSV file')).toBeInTheDocument();
}, 10000);

test('Calculates total income for the given period successfully (from calculateTotalIncome_overExpenseNotification)', async () => {
  fetchMock.post('/api/calculate-income', {
    body: { total: 2000 },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-total-income'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-income-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Income: 2000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total income due to missing period (from calculateTotalIncome_overExpenseNotification)', async () => {
  fetchMock.post('/api/calculate-income', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-total-income'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-income-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Missing period')).toBeInTheDocument();
}, 10000);

test('successfully notifies when expenses exceed income for a given period (from calculateTotalIncome_overExpenseNotification)', async () => {
  fetchMock.get('/api/expenses/notification', { status: 200, body: { notify: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('notify-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expenses exceed income!')).toBeInTheDocument();
}, 10000);

test('fails to notify when expenses exceed income for a given period (from calculateTotalIncome_overExpenseNotification)', async () => {
  fetchMock.get('/api/expenses/notification', { status: 200, body: { notify: false } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('notify-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No notification needed.')).toBeInTheDocument();
}, 10000);

