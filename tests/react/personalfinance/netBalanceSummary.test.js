import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './netBalanceSummary';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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