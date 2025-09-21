import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteProductFromCatalog_purchaseReport_trackSupplierOrders';

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

test('Generates purchase report successfully.', async () => {
  fetchMock.post('/api/purchase-report', { body: { status: 'success', data: { /* ...expected data... */ }} });

  await act(async () => { render(<MemoryRouter><PurchaseReport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-data')).toBeInTheDocument();
}, 10000);

test('Fails to generate purchase report due to server error.', async () => {
  fetchMock.post('/api/purchase-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><PurchaseReport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Successfully tracks supplier orders.', async () => {
  fetchMock.get('/api/suppliers/1/orders', { status: 200, body: { orders: ['Order1', 'Order2'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('track-orders-button')); });

  expect(fetchMock.called('/api/suppliers/1/orders')).toBe(true);
  expect(screen.getByText('Order1')).toBeInTheDocument();
  expect(screen.getByText('Order2')).toBeInTheDocument();
}, 10000);

test('Fails to track supplier orders.', async () => {
  fetchMock.get('/api/suppliers/1/orders', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('track-orders-button')); });

  expect(fetchMock.called('/api/suppliers/1/orders')).toBe(true);
  expect(screen.getByText('Failed to track orders')).toBeInTheDocument();
}, 10000);
