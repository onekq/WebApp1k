import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './assignTagstoExpenses_deleteRecurringIncome_editExistingExpense_expenseTracking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('assigns tags to expenses successfully (from assignTagstoExpenses_deleteRecurringIncome)', async () => {
  fetchMock.post('/api/tag', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Groceries' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-tag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tag added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to assign tags to expenses (from assignTagstoExpenses_deleteRecurringIncome)', async () => {
  fetchMock.post('/api/tag', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Groceries' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-tag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding tag.')).toBeInTheDocument();
}, 10000);

test('successfully deletes a recurring income (from assignTagstoExpenses_deleteRecurringIncome)', async () => {
  fetchMock.delete('/income/recurring/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete recurring income/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/recurring income deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to delete a recurring income (from assignTagstoExpenses_deleteRecurringIncome)', async () => {
  fetchMock.delete('/income/recurring/1', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete recurring income/i));
  });

  expect(fetchMock.calls('/income/recurring/1')).toHaveLength(1);
  expect(screen.getByText(/failed to delete recurring income/i)).toBeInTheDocument();
}, 10000);

test('edits an existing expense successfully (from editExistingExpense_expenseTracking)', async () => {
  fetchMock.put('/api/expense/1', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expense-amount-input-1'), { target: { value: '200' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense updated successfully!')).toBeInTheDocument();
}, 10000);

test('fails to edit an existing expense (from editExistingExpense_expenseTracking)', async () => {
  fetchMock.put('/api/expense/1', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expense-amount-input-1'), { target: { value: '200' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-expense-button-1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error updating expense.')).toBeInTheDocument();
}, 10000);

test('Success: Track expenses by payment method. (from editExistingExpense_expenseTracking)', async () => {
  fetchMock.get('/api/track-expense-by-method', { status: 200, body: { success: true, result: 'Credit: 400, Cash: 300' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('track-expense-method-btn'));
  });

  expect(fetchMock.calls('/api/track-expense-by-method').length).toBe(1);
  expect(screen.getByText('Tracking result: Credit: 400, Cash: 300')).toBeInTheDocument();
}, 10000);

test('Failure: Track expenses by payment method. (from editExistingExpense_expenseTracking)', async () => {
  fetchMock.get('/api/track-expense-by-method', { status: 500, body: { error: 'Tracking error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('track-expense-method-btn'));
  });

  expect(fetchMock.calls('/api/track-expense-by-method').length).toBe(1);
  expect(screen.getByText('Tracking error')).toBeInTheDocument();
}, 10000);

