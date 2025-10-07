import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteMonthlyBudget_splitExpense_categorizeIcomeSource_compareIncomeAgainstGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: Delete a monthly budget. (from deleteMonthlyBudget_splitExpense)', async () => {
  fetchMock.delete('/api/delete-budget', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Groceries' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-budget-btn'));
  });

  expect(fetchMock.calls('/api/delete-budget').length).toBe(1);
  expect(screen.getByText('Budget deleted successfully!')).toBeInTheDocument();
}, 10000);

test('Failure: Delete a monthly budget. (from deleteMonthlyBudget_splitExpense)', async () => {
  fetchMock.delete('/api/delete-budget', { status: 400, body: { error: 'Budget not found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Groceries' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-budget-btn'));
  });

  expect(fetchMock.calls('/api/delete-budget').length).toBe(1);
  expect(screen.getByText('Budget not found')).toBeInTheDocument();
}, 10000);

test('splits an expense into multiple categories successfully (from deleteMonthlyBudget_splitExpense)', async () => {
  fetchMock.post('/api/split-expense', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('split-expense-input'), { target: { value: '150' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-split-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense split successfully!')).toBeInTheDocument();
}, 10000);

test('fails to split an expense into multiple categories (from deleteMonthlyBudget_splitExpense)', async () => {
  fetchMock.post('/api/split-expense', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('split-expense-input'), { target: { value: '150' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-split-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error splitting expense.')).toBeInTheDocument();
}, 10000);

test('successfully categorizes an income source (from categorizeIcomeSource_compareIncomeAgainstGoal)', async () => {
  fetchMock.post('/income/1/categorize', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Job' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/categorize income source/i));
  });

  expect(fetchMock.calls('/income/1/categorize')).toHaveLength(1);
  expect(screen.getByText(/income source categorized successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to categorize an income source (from categorizeIcomeSource_compareIncomeAgainstGoal)', async () => {
  fetchMock.post('/income/1/categorize', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/categorize income source/i));
  });

  expect(fetchMock.calls('/income/1/categorize')).toHaveLength(1);
  expect(screen.getByText(/failed to categorize income source/i)).toBeInTheDocument();
}, 10000);

test('Compares income against a goal for the given period successfully (from categorizeIcomeSource_compareIncomeAgainstGoal)', async () => {
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

test('Fails to compare income against a goal due to server error (from categorizeIcomeSource_compareIncomeAgainstGoal)', async () => {
  fetchMock.post('/api/compare-income-goal', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-income-goal'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('compare-income-goal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server error')).toBeInTheDocument();
}, 10000);

