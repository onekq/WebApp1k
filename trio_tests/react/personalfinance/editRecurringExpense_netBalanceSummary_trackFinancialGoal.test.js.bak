import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editRecurringExpense_netBalanceSummary_trackFinancialGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('edits a recurring expense successfully', async () => {
  fetchMock.put('/api/recurring-expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input-1'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recurring expense updated successfully!')).toBeInTheDocument();
}, 10000);

test('fails to edit a recurring expense', async () => {
  fetchMock.put('/api/recurring-expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input-1'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error updating recurring expense.')).toBeInTheDocument();
}, 10000);

test('Generates a summary of net balance successfully', async () => {
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

test('Fails to generate a summary of net balance due to invalid data', async () => {
  fetchMock.post('/api/net-balance-summary', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-net-balance-summary'), { target: { value: 'invalid-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-net-balance-summary-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid data')).toBeInTheDocument();
}, 10000);

test('successfully tracks progress towards a financial goal', async () => {
  fetchMock.get('/api/goal/progress/1', { status: 200, body: { progress: 50 } });

  await act(async () => {
    render(<MemoryRouter><TrackProgress /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('track-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('50% towards your goal!')).toBeInTheDocument();
}, 10000);

test('fails to track progress towards a financial goal', async () => {
  fetchMock.get('/api/goal/progress/1', { status: 404, body: { error: 'Goal not found' } });

  await act(async () => {
    render(<MemoryRouter><TrackProgress /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('track-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal not found')).toBeInTheDocument();
}, 10000);
