import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './handleReturns_trackSupplierOrders_handleBackorders_manageMultipleWarehouses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Ensure handling returns updates inventory levels and order status correctly. (from handleReturns_trackSupplierOrders)', async () => {
  fetchMock.post('/api/returns', { status: 200, body: { success: true, newStockLevel: 105 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('returnInput'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitReturn')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('newStockLevel')).toHaveTextContent('105');
}, 10000);

test('Successfully tracks supplier orders. (from handleReturns_trackSupplierOrders)', async () => {
  fetchMock.get('/api/suppliers/1/orders', { status: 200, body: { orders: ['Order1', 'Order2'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('track-orders-button')); });

  expect(fetchMock.called('/api/suppliers/1/orders')).toBe(true);
  expect(screen.getByText('Order1')).toBeInTheDocument();
  expect(screen.getByText('Order2')).toBeInTheDocument();
}, 10000);

test('Fails to track supplier orders. (from handleReturns_trackSupplierOrders)', async () => {
  fetchMock.get('/api/suppliers/1/orders', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('track-orders-button')); });

  expect(fetchMock.called('/api/suppliers/1/orders')).toBe(true);
  expect(screen.getByText('Failed to track orders')).toBeInTheDocument();
}, 10000);

test('Updates stock levels and order status correctly for backorders (from handleBackorders_manageMultipleWarehouses)', async () => {
  fetchMock.post('/api/backorders', { success: true, updatedStock: 80 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Process Backorder/i)); });

  expect(fetchMock.calls('/api/backorders').length).toBe(1);
  expect(screen.getByText(/Backorder processed. Updated Stock: 80/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when processing backorders (from handleBackorders_manageMultipleWarehouses)', async () => {
  fetchMock.post('/api/backorders', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Process Backorder/i)); });

  expect(fetchMock.calls('/api/backorders').length).toBe(1);
  expect(screen.getByText(/Error processing backorder/i)).toBeInTheDocument();
}, 10000);

test('Reflects correct stock levels per warehouse on success (from handleBackorders_manageMultipleWarehouses)', async () => {
  fetchMock.get('/api/warehouses', { warehouse1: 100, warehouse2: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/warehouses').length).toBe(1);
  expect(screen.getByText(/Warehouse1: 100/i)).toBeInTheDocument();
  expect(screen.getByText(/Warehouse2: 200/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when fetching warehouse data (from handleBackorders_manageMultipleWarehouses)', async () => {
  fetchMock.get('/api/warehouses', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/warehouses').length).toBe(1);
  expect(screen.getByText(/Error fetching warehouse data/i)).toBeInTheDocument();
}, 10000);

