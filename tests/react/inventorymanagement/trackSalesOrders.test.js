import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './trackSalesOrders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Ensure tracking sales orders shows all relevant orders correctly.', async () => {
  fetchMock.get('/api/sales-orders', { status: 200, body: { orders: [{ id: 1, item: 'Product A', quantity: 5 }] } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackSalesOrders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product A')).toBeInTheDocument();
}, 10000);

test("Tracking sales orders doesn't show orders due to error.", async () => {
  fetchMock.get('/api/sales-orders', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackSalesOrders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching sales orders.')).toBeInTheDocument();
}, 10000);

