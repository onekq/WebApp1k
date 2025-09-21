import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addRecurringExpense_mergeExpenses_overBudgetNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('adds a recurring expense successfully', async () => {
  fetchMock.post('/api/recurring-expense', { success: true });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input'), { target: { value: '50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-recurring-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recurring expense added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to add a recurring expense', async () => {
  fetchMock.post('/api/recurring-expense', { success: false });

  await act(async () => { render(<MemoryRouter><ExpenseManager /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurring-expense-input'), { target: { value: '50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-recurring-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding recurring expense.')).toBeInTheDocument();
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

test('Success: Notify when an expense exceeds the budget for a category.', async () => {
  fetchMock.get('/api/check-expense-exceed', { status: 200, body: { exceeds: true } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('check-expense-exceed-btn'));
  });

  expect(fetchMock.calls('/api/check-expense-exceed').length).toBe(1);
  expect(screen.getByText('Expense exceeds budget!')).toBeInTheDocument();
}, 10000);

test('Failure: Notify when an expense exceeds the budget for a category.', async () => {
  fetchMock.get('/api/check-expense-exceed', { status: 200, body: { exceeds: false } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('check-expense-exceed-btn'));
  });

  expect(fetchMock.calls('/api/check-expense-exceed').length).toBe(1);
  expect(screen.getByText('Expense does not exceed budget.')).toBeInTheDocument();
}, 10000);
