import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateIncomeSaving_incomeSummary_predictFutureIncome';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully calculates the percentage of income saved', async () => {
  fetchMock.get('/api/income/saved', { status: 200, body: { percentage: 20 } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('20% of income saved!')).toBeInTheDocument();
}, 10000);

test('fails to calculate the percentage of income saved', async () => {
  fetchMock.get('/api/income/saved', { status: 400, body: { error: 'Error calculating' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error calculating')).toBeInTheDocument();
}, 10000);

test('Generates a summary of income by source successfully', async () => {
  fetchMock.post('/api/income-summary', {
    body: { data: 'Income Summary Data' },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-income-summary'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-income-summary-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Income Summary Data')).toBeInTheDocument();
}, 10000);

test('Fails to generate a summary of income due to missing data', async () => {
  fetchMock.post('/api/income-summary', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-income-summary'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-income-summary-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Missing data')).toBeInTheDocument();
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
