import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateRemainingAmount_expenseSummary_editRecurringExpense_splitExpense';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully calculates remaining amount to reach a financial goal (from calculateRemainingAmount_expenseSummary)', async () => {
  fetchMock.get('/api/goal/remaining/1', { status: 200, body: { remaining: 500 } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('$500 remaining to reach your goal!')).toBeInTheDocument();
}, 10000);

test('fails to calculate remaining amount to reach a financial goal (from calculateRemainingAmount_expenseSummary)', async () => {
  fetchMock.get('/api/goal/remaining/1', { status: 404, body: { error: 'Goal not found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal not found')).toBeInTheDocument();
}, 10000);

test('Success: Generate a summary of expenses by category. (from calculateRemainingAmount_expenseSummary)', async () => {
  fetchMock.get('/api/summary', { status: 200, body: { success: true, summary: 'Food: 500, Transport: 200' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-summary-btn'));
  });

  expect(fetchMock.calls('/api/summary').length).toBe(1);
  expect(screen.getByText('Summary generated: Food: 500, Transport: 200')).toBeInTheDocument();
}, 10000);

test('Failure: Generate a summary of expenses by category. (from calculateRemainingAmount_expenseSummary)', async () => {
  fetchMock.get('/api/summary', { status: 500, body: { error: 'Summary error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-summary-btn'));
  });

  expect(fetchMock.calls('/api/summary').length).toBe(1);
  expect(screen.getByText('Summary error')).toBeInTheDocument();
}, 10000);

test('edits a recurring expense successfully (from editRecurringExpense_splitExpense)', async () => {
  fetchMock.put('/api/recurring-expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input-1'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recurring expense updated successfully!')).toBeInTheDocument();
}, 10000);

test('fails to edit a recurring expense (from editRecurringExpense_splitExpense)', async () => {
  fetchMock.put('/api/recurring-expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input-1'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error updating recurring expense.')).toBeInTheDocument();
}, 10000);

test('splits an expense into multiple categories successfully (from editRecurringExpense_splitExpense)', async () => {
  fetchMock.post('/api/split-expense', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('split-expense-input'), { target: { value: '150' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-split-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense split successfully!')).toBeInTheDocument();
}, 10000);

test('fails to split an expense into multiple categories (from editRecurringExpense_splitExpense)', async () => {
  fetchMock.post('/api/split-expense', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('split-expense-input'), { target: { value: '150' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-split-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error splitting expense.')).toBeInTheDocument();
}, 10000);

