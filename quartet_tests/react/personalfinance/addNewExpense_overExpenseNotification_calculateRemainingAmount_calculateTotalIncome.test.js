import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addNewExpense_overExpenseNotification_calculateRemainingAmount_calculateTotalIncome';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('adds a new expense successfully (from addNewExpense_overExpenseNotification)', async () => {
  fetchMock.post('/api/expense', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to add a new expense (from addNewExpense_overExpenseNotification)', async () => {
  fetchMock.post('/api/expense', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expense-amount-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-expense-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding expense.')).toBeInTheDocument();
}, 10000);

test('successfully notifies when expenses exceed income for a given period (from addNewExpense_overExpenseNotification)', async () => {
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

test('fails to notify when expenses exceed income for a given period (from addNewExpense_overExpenseNotification)', async () => {
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

test('successfully calculates remaining amount to reach a financial goal (from calculateRemainingAmount_calculateTotalIncome)', async () => {
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

test('fails to calculate remaining amount to reach a financial goal (from calculateRemainingAmount_calculateTotalIncome)', async () => {
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

test('Calculates total income for the given period successfully (from calculateRemainingAmount_calculateTotalIncome)', async () => {
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

test('Fails to calculate total income due to missing period (from calculateRemainingAmount_calculateTotalIncome)', async () => {
  fetchMock.post('/api/calculate-income', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-total-income'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-income-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Missing period')).toBeInTheDocument();
}, 10000);

