import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteMonthlyBudget_expenseTracking_calculateExpense_predictFutureExpenses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: Delete a monthly budget. (from deleteMonthlyBudget_expenseTracking)', async () => {
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

test('Failure: Delete a monthly budget. (from deleteMonthlyBudget_expenseTracking)', async () => {
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

test('Success: Track expenses by payment method. (from deleteMonthlyBudget_expenseTracking)', async () => {
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

test('Failure: Track expenses by payment method. (from deleteMonthlyBudget_expenseTracking)', async () => {
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

test('successfully calculates the percentage of expenses in each category (from calculateExpense_predictFutureExpenses)', async () => {
  fetchMock.get('/api/expenses/categories', { status: 200, body: { percentages: { food: 30, entertainment: 20 } } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Food: 30%, Entertainment: 20%')).toBeInTheDocument();
}, 10000);

test('fails to calculate the percentage of expenses in each category (from calculateExpense_predictFutureExpenses)', async () => {
  fetchMock.get('/api/expenses/categories', { status: 400, body: { error: 'Calculation error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Calculation error')).toBeInTheDocument();
}, 10000);

test('Success: Predict future expenses based on past data. (from calculateExpense_predictFutureExpenses)', async () => {
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

test('Failure: Predict future expenses based on past data. (from calculateExpense_predictFutureExpenses)', async () => {
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

