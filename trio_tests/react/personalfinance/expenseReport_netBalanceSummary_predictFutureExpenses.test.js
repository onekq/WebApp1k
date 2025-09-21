import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './expenseReport_netBalanceSummary_predictFutureExpenses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Generates an expense report for the given period successfully', async () => {
  fetchMock.post('/api/expense-report', {
    body: { data: 'Expense Report Data' },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period'), { target: { value: '2023-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Expense Report Data')).toBeInTheDocument();
}, 10000);

test('Fails to generate an expense report due to missing period', async () => {
  fetchMock.post('/api/expense-report', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid period')).toBeInTheDocument();
}, 10000);

test('Generates a summary of net balance successfully', async () => {
  fetchMock.post('/api/net-balance-summary', {
    body: { data: 'Net Balance Summary Data' },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-net-balance-summary'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-net-balance-summary-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Net Balance Summary Data')).toBeInTheDocument();
}, 10000);

test('Fails to generate a summary of net balance due to invalid data', async () => {
  fetchMock.post('/api/net-balance-summary', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-net-balance-summary'), { target: { value: 'invalid-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-net-balance-summary-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid data')).toBeInTheDocument();
}, 10000);

test('Success: Predict future expenses based on past data.', async () => {
  fetchMock.post('/api/predict-expense', { status: 200, body: { success: true, prediction: 300 } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('predict-expense-btn'));
  });

  expect(fetchMock.calls('/api/predict-expense').length).toBe(1);
  expect(screen.getByText('Predicted future expense: 300')).toBeInTheDocument();
}, 10000);

test('Failure: Predict future expenses based on past data.', async () => {
  fetchMock.post('/api/predict-expense', { status: 500, body: { error: 'Prediction error' } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('predict-expense-btn'));
  });

  expect(fetchMock.calls('/api/predict-expense').length).toBe(1);
  expect(screen.getByText('Prediction error')).toBeInTheDocument();
}, 10000);
