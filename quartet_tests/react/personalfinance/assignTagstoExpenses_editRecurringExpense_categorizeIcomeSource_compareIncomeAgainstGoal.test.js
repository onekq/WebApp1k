import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './assignTagstoExpenses_editRecurringExpense_categorizeIcomeSource_compareIncomeAgainstGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('assigns tags to expenses successfully (from assignTagstoExpenses_editRecurringExpense)', async () => {
  fetchMock.post('/api/tag', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Groceries' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-tag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tag added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to assign tags to expenses (from assignTagstoExpenses_editRecurringExpense)', async () => {
  fetchMock.post('/api/tag', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Groceries' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-tag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding tag.')).toBeInTheDocument();
}, 10000);

test('edits a recurring expense successfully (from assignTagstoExpenses_editRecurringExpense)', async () => {
  fetchMock.put('/api/recurring-expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input-1'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recurring expense updated successfully!')).toBeInTheDocument();
}, 10000);

test('fails to edit a recurring expense (from assignTagstoExpenses_editRecurringExpense)', async () => {
  fetchMock.put('/api/recurring-expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input-1'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-recurring-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error updating recurring expense.')).toBeInTheDocument();
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

