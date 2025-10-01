import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteProductFromCatalog_generatePurchaseOrderReceipt_trackSalesOrders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Deleting a product removes it from the inventory list.', async () => {
  fetchMock.delete('/products/1', 204);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/delete/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.queryByText(/product 1 name/i)).not.toBeInTheDocument();
}, 10000);

test('Deleting a product shows an error message if the deletion fails.', async () => {
  fetchMock.delete('/products/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/delete/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/error deleting product/i)).toBeInTheDocument();
}, 10000);

test('Ensure generating a purchase order receipt includes all relevant details.', async () => {
  fetchMock.get('/api/purchase-receipt', { status: 200, body: { receipt: { id: 1, total: 200, items: [{ item: 'Product B', quantity: 10 }] } } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generateReceipt')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product B')).toBeInTheDocument();
  expect(screen.getByText('200')).toBeInTheDocument();
}, 10000);

test('Generating a purchase order receipt doesn\'t show details due to error.', async () => {
  fetchMock.get('/api/purchase-receipt', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generateReceipt')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error generating receipt.')).toBeInTheDocument();
}, 10000);

test('Ensure tracking sales orders shows all relevant orders correctly.', async () => {
  fetchMock.get('/api/sales-orders', { status: 200, body: { orders: [{ id: 1, item: 'Product A', quantity: 5 }] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackSalesOrders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product A')).toBeInTheDocument();
}, 10000);

test('Tracking sales orders doesn\'t show orders due to error.', async () => {
  fetchMock.get('/api/sales-orders', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackSalesOrders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching sales orders.')).toBeInTheDocument();
}, 10000);
