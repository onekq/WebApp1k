import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateNetBalance_calculateRemainingAmount_incomeSummary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Calculates net balance for the given period successfully', async () => {
  fetchMock.post('/api/calculate-net-balance', {
    body: { balance: 1000 },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-net-balance'), { target: { value: '2023-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-net-balance-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Net Balance: 1000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate net balance due to missing period', async () => {
  fetchMock.post('/api/calculate-net-balance', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-net-balance'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-net-balance-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Missing period')).toBeInTheDocument();
}, 10000);

test('successfully calculates remaining amount to reach a financial goal', async () => {
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

test('fails to calculate remaining amount to reach a financial goal', async () => {
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
