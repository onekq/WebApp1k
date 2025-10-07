import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './predictFutureIncome_tagIncomeSources_calculateIncomeSaving_netBalanceSummary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully predicts future income based on past data (from predictFutureIncome_tagIncomeSources)', async () => {
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

test('fails to predict future income based on past data (from predictFutureIncome_tagIncomeSources)', async () => {
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

test('successfully assigns tags to an income source (from predictFutureIncome_tagIncomeSources)', async () => {
  fetchMock.post('/income/1/tags', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'Bonus,Part-time' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/assign tags/i));
  });

  expect(fetchMock.calls('/income/1/tags')).toHaveLength(1);
  expect(screen.getByText(/tags assigned successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to assign tags to an income source (from predictFutureIncome_tagIncomeSources)', async () => {
  fetchMock.post('/income/1/tags', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App incomeId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/assign tags/i));
  });

  expect(fetchMock.calls('/income/1/tags')).toHaveLength(1);
  expect(screen.getByText(/failed to assign tags/i)).toBeInTheDocument();
}, 10000);

test('successfully calculates the percentage of income saved (from calculateIncomeSaving_netBalanceSummary)', async () => {
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

test('fails to calculate the percentage of income saved (from calculateIncomeSaving_netBalanceSummary)', async () => {
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

test('Generates a summary of net balance successfully (from calculateIncomeSaving_netBalanceSummary)', async () => {
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

test('Fails to generate a summary of net balance due to invalid data (from calculateIncomeSaving_netBalanceSummary)', async () => {
  fetchMock.post('/api/net-balance-summary', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-net-balance-summary'), { target: { value: 'invalid-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-net-balance-summary-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid data')).toBeInTheDocument();
}, 10000);

