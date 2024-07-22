import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './trackPurchaseOrders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Validate tracking purchase orders shows all relevant orders correctly.', async () => {
  fetchMock.get('/api/purchase-orders', { status: 200, body: { orders: [{ id: 1, item: 'Product B', quantity: 10 }] } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackPurchaseOrders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product B')).toBeInTheDocument();
}, 10000);

test('Tracking purchase orders doesn\'t show orders due to error.', async () => {
  fetchMock.get('/api/purchase-orders', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackPurchaseOrders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching purchase orders.')).toBeInTheDocument();
}, 10000);

