import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './reorderReport_setReorderLevel_handleReturns_trackSupplierOrders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Generates reorder report successfully. (from reorderReport_setReorderLevel)', async () => {
  fetchMock.post('/api/reorder-report', { body: { status: 'success', data: { /* ...expected data... */ }} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-data')).toBeInTheDocument();
}, 10000);

test('Fails to generate reorder report due to server error. (from reorderReport_setReorderLevel)', async () => {
  fetchMock.post('/api/reorder-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Triggers alert on setting reorder level successfully (from reorderReport_setReorderLevel)', async () => {
  fetchMock.post('/api/reorder/level', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Reorder Level/i), { target: { value: 30 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Reorder Level/i)); });

  expect(fetchMock.calls('/api/reorder/level').length).toBe(1);
  expect(screen.getByText(/Reorder level set successfully/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when setting reorder level (from reorderReport_setReorderLevel)', async () => {
  fetchMock.post('/api/reorder/level', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Reorder Level/i), { target: { value: 30 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Reorder Level/i)); });

  expect(fetchMock.calls('/api/reorder/level').length).toBe(1);
  expect(screen.getByText(/Error setting reorder level/i)).toBeInTheDocument();
}, 10000);

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

