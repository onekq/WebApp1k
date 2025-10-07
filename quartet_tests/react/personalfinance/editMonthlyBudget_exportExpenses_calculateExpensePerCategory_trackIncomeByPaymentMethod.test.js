import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editMonthlyBudget_exportExpenses_calculateExpensePerCategory_trackIncomeByPaymentMethod';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: Edit a monthly budget. (from editMonthlyBudget_exportExpenses)', async () => {
  fetchMock.put('/api/edit-budget', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Groceries' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('budget-input'), { target: { value: '600' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-budget-btn'));
  });

  expect(fetchMock.calls('/api/edit-budget').length).toBe(1);
  expect(screen.getByText('Budget updated successfully!')).toBeInTheDocument();
}, 10000);

test('Failure: Edit a monthly budget. (from editMonthlyBudget_exportExpenses)', async () => {
  fetchMock.put('/api/edit-budget', { status: 400, body: { error: 'Budget not found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('category-input'), { target: { value: 'Groceries' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('budget-input'), { target: { value: '600' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-budget-btn'));
  });

  expect(fetchMock.calls('/api/edit-budget').length).toBe(1);
  expect(screen.getByText('Budget not found')).toBeInTheDocument();
}, 10000);

test('Exports expenses to a CSV file successfully (from editMonthlyBudget_exportExpenses)', async () => {
  fetchMock.post('/api/export-csv', {
    body: { success: true },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-csv-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export successful')).toBeInTheDocument();
}, 10000);

test('Fails to export expenses to a CSV file due to server error (from editMonthlyBudget_exportExpenses)', async () => {
  fetchMock.post('/api/export-csv', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-csv-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export failed')).toBeInTheDocument();
}, 10000);

test('Success: Calculate the average expense per category for a given period. (from calculateExpensePerCategory_trackIncomeByPaymentMethod)', async () => {
  fetchMock.get('/api/calculate-average', { status: 200, body: { average: 250 } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-average-btn'));
  });

  expect(fetchMock.calls('/api/calculate-average').length).toBe(1);
  expect(screen.getByText('Average expense: 250')).toBeInTheDocument();
}, 10000);

test('Failure: Calculate the average expense per category for a given period. (from calculateExpensePerCategory_trackIncomeByPaymentMethod)', async () => {
  fetchMock.get('/api/calculate-average', { status: 400, body: { error: 'Calculation error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-average-btn'));
  });

  expect(fetchMock.calls('/api/calculate-average').length).toBe(1);
  expect(screen.getByText('Calculation error')).toBeInTheDocument();
}, 10000);

test('successfully tracks income by payment method (from calculateExpensePerCategory_trackIncomeByPaymentMethod)', async () => {
  fetchMock.get('/income/payment-method/credit-card', { status: 200, body: [{ id: 1, name: 'Salary' }] });

  await act(async () => {
    render(<MemoryRouter><App paymentMethod="credit-card" /></MemoryRouter>);
  });

  expect(fetchMock.calls('/income/payment-method/credit-card')).toHaveLength(1);
  expect(screen.getByText(/salary/i)).toBeInTheDocument();
}, 10000);

test('fails to track income by payment method (from calculateExpensePerCategory_trackIncomeByPaymentMethod)', async () => {
  fetchMock.get('/income/payment-method/credit-card', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App paymentMethod="credit-card" /></MemoryRouter>);
  });

  expect(fetchMock.calls('/income/payment-method/credit-card')).toHaveLength(1);
  expect(screen.getByText(/failed to track income by payment method/i)).toBeInTheDocument();
}, 10000);

