import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './overBudgetNotification_overExpenseNotification_categorizeExpenses_predictFutureExpenses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: Notify when an expense exceeds the budget for a category. (from overBudgetNotification_overExpenseNotification)', async () => {
  fetchMock.get('/api/check-expense-exceed', { status: 200, body: { exceeds: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('check-expense-exceed-btn'));
  });

  expect(fetchMock.calls('/api/check-expense-exceed').length).toBe(1);
  expect(screen.getByText('Expense exceeds budget!')).toBeInTheDocument();
}, 10000);

test('Failure: Notify when an expense exceeds the budget for a category. (from overBudgetNotification_overExpenseNotification)', async () => {
  fetchMock.get('/api/check-expense-exceed', { status: 200, body: { exceeds: false } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('check-expense-exceed-btn'));
  });

  expect(fetchMock.calls('/api/check-expense-exceed').length).toBe(1);
  expect(screen.getByText('Expense does not exceed budget.')).toBeInTheDocument();
}, 10000);

test('successfully notifies when expenses exceed income for a given period (from overBudgetNotification_overExpenseNotification)', async () => {
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

test('fails to notify when expenses exceed income for a given period (from overBudgetNotification_overExpenseNotification)', async () => {
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

test('categorizes expenses successfully (from categorizeExpenses_predictFutureExpenses)', async () => {
  fetchMock.post('/api/category', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Food' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-category-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Category added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to categorize expenses (from categorizeExpenses_predictFutureExpenses)', async () => {
  fetchMock.post('/api/category', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Food' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-category-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding category.')).toBeInTheDocument();
}, 10000);

test('Success: Predict future expenses based on past data. (from categorizeExpenses_predictFutureExpenses)', async () => {
  fetchMock.post('/api/predict-expense', { status: 200, body: { success: true, prediction: 300 } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('predict-expense-btn'));
  });

  expect(fetchMock.calls('/api/predict-expense').length).toBe(1);
  expect(screen.getByText('Predicted future expense: 300')).toBeInTheDocument();
}, 10000);

test('Failure: Predict future expenses based on past data. (from categorizeExpenses_predictFutureExpenses)', async () => {
  fetchMock.post('/api/predict-expense', { status: 500, body: { error: 'Prediction error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('predict-expense-btn'));
  });

  expect(fetchMock.calls('/api/predict-expense').length).toBe(1);
  expect(screen.getByText('Prediction error')).toBeInTheDocument();
}, 10000);

