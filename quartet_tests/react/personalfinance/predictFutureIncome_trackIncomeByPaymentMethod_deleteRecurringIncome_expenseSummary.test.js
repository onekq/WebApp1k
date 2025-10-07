import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './predictFutureIncome_trackIncomeByPaymentMethod_deleteRecurringIncome_expenseSummary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully predicts future income based on past data (from predictFutureIncome_trackIncomeByPaymentMethod)', async () => {
  fetchMock.get('/api/income/predict', { status: 200, body: { prediction: 5000 } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('predict-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Predicted income is $5000')).toBeInTheDocument();
}, 10000);

test('fails to predict future income based on past data (from predictFutureIncome_trackIncomeByPaymentMethod)', async () => {
  fetchMock.get('/api/income/predict', { status: 400, body: { error: 'Prediction error' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('predict-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Prediction error')).toBeInTheDocument();
}, 10000);

test('successfully tracks income by payment method (from predictFutureIncome_trackIncomeByPaymentMethod)', async () => {
  fetchMock.get('/income/payment-method/credit-card', { status: 200, body: [{ id: 1, name: 'Salary' }] });

  await act(async () => {
    render(<MemoryRouter><App paymentMethod="credit-card" /></MemoryRouter>);
  });

  expect(fetchMock.calls('/income/payment-method/credit-card')).toHaveLength(1);
  expect(screen.getByText(/salary/i)).toBeInTheDocument();
}, 10000);

test('fails to track income by payment method (from predictFutureIncome_trackIncomeByPaymentMethod)', async () => {
  fetchMock.get('/income/payment-method/credit-card', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App paymentMethod="credit-card" /></MemoryRouter>);
  });

  expect(fetchMock.calls('/income/payment-method/credit-card')).toHaveLength(1);
  expect(screen.getByText(/failed to track income by payment method/i)).toBeInTheDocument();
}, 10000);

test('successfully deletes a recurring income (from deleteRecurringIncome_expenseSummary)', async () => {
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

test('fails to delete a recurring income (from deleteRecurringIncome_expenseSummary)', async () => {
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

test('Success: Generate a summary of expenses by category. (from deleteRecurringIncome_expenseSummary)', async () => {
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

test('Failure: Generate a summary of expenses by category. (from deleteRecurringIncome_expenseSummary)', async () => {
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

