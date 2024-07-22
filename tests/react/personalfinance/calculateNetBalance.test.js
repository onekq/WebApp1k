import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateNetBalance';

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

