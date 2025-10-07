import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addRecurringExpense_editRecurringIncome_calculateIncomeSaving_netBalanceSummary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('adds a recurring expense successfully (from addRecurringExpense_editRecurringIncome)', async () => {
  fetchMock.post('/api/recurring-expense', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input'), { target: { value: '50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-recurring-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recurring expense added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to add a recurring expense (from addRecurringExpense_editRecurringIncome)', async () => {
  fetchMock.post('/api/recurring-expense', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input'), { target: { value: '50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-recurring-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding recurring expense.')).toBeInTheDocument();
}, 10000);

test('successfully edits a recurring income (from addRecurringExpense_editRecurringIncome)', async () => {
  fetchMock.put('/income/recurring/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: 'Updated Salary' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/save changes/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/recurring income updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to edit a recurring income (from addRecurringExpense_editRecurringIncome)', async () => {
  fetchMock.put('/income/recurring/1', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/source name/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/save changes/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/failed to update recurring income/i)).toBeInTheDocument();
}, 10000);

test('successfully calculates the percentage of income saved (from calculateIncomeSaving_netBalanceSummary)', async () => {
  fetchMock.get('/api/income/saved', { status: 200, body: { percentage: 20 } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('20% of income saved!')).toBeInTheDocument();
}, 10000);

test('fails to calculate the percentage of income saved (from calculateIncomeSaving_netBalanceSummary)', async () => {
  fetchMock.get('/api/income/saved', { status: 400, body: { error: 'Error calculating' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error calculating')).toBeInTheDocument();
}, 10000);

test('Generates a summary of net balance successfully (from calculateIncomeSaving_netBalanceSummary)', async () => {
  fetchMock.post('/api/net-balance-summary', {
    body: { data: 'Net Balance Summary Data' },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-net-balance-summary'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-net-balance-summary-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Net Balance Summary Data')).toBeInTheDocument();
}, 10000);

test('Fails to generate a summary of net balance due to invalid data (from calculateIncomeSaving_netBalanceSummary)', async () => {
  fetchMock.post('/api/net-balance-summary', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-net-balance-summary'), { target: { value: 'invalid-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-net-balance-summary-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid data')).toBeInTheDocument();
}, 10000);

