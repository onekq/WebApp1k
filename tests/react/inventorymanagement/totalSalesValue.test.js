import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TotalSalesValue from './totalSalesValue';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Calculates total sales value successfully.', async () => {
  fetchMock.post('/api/total-sales-value', { body: { status: 'success', data: { value: 20000 }}});

  await act(async () => { render(<MemoryRouter><TotalSalesValue /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Sales Value: $20,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total sales value due to server error.', async () => {
  fetchMock.post('/api/total-sales-value', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><TotalSalesValue /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

