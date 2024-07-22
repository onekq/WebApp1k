import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './netBalanceReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Generates a net balance report for the given period successfully', async () => {
  fetchMock.post('/api/net-balance-report', {
    body: { data: 'Net Balance Report Data' },
    headers: { 'content-type': 'application/json' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-balance'), { target: { value: '2023-01-01' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-balance-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Net Balance Report Data')).toBeInTheDocument();
}, 10000);

test('Fails to generate a net balance report due to invalid period', async () => {
  fetchMock.post('/api/net-balance-report', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('report-period-balance'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-balance-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid period')).toBeInTheDocument();
}, 10000);

