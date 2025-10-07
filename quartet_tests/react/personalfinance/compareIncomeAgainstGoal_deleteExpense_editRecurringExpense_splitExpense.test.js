import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareIncomeAgainstGoal_deleteExpense_editRecurringExpense_splitExpense';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Compares income against a goal for the given period successfully (from compareIncomeAgainstGoal_deleteExpense)', async () => {
  fetchMock.post('/api/compare-income-goal', {
    body: { result: 'Goal Met' },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-income-goal'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-income-goal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal Met')).toBeInTheDocument();
}, 10000);

test('Fails to compare income against a goal due to server error (from compareIncomeAgainstGoal_deleteExpense)', async () => {
  fetchMock.post('/api/compare-income-goal', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-income-goal'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-income-goal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);

test('deletes an expense successfully (from compareIncomeAgainstGoal_deleteExpense)', async () => {
  fetchMock.delete('/api/expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense deleted successfully!')).toBeInTheDocument();
}, 10000);

test('fails to delete an expense (from compareIncomeAgainstGoal_deleteExpense)', async () => {
  fetchMock.delete('/api/expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error deleting expense.')).toBeInTheDocument();
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

