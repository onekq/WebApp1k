import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteFinancialGoal_expenseReport_predictFutureIncome';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully deletes a financial goal', async () => {
  fetchMock.delete('/api/goal/1', { status: 200, body: {} });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal deleted successfully!')).toBeInTheDocument();
}, 10000);

test('fails to delete a financial goal', async () => {
  fetchMock.delete('/api/goal/1', { status: 404, body: { error: 'Goal not found' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Goal not found')).toBeInTheDocument();
}, 10000);

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

test('successfully predicts future income based on past data', async () => {
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

test('fails to predict future income based on past data', async () => {
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
