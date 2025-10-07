import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './inventoryPerformanceReport_processPurchaseOrder_handleBackorders_setStockThresholds';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Generates inventory performance report successfully. (from inventoryPerformanceReport_processPurchaseOrder)', async () => {
  fetchMock.post('/api/inventory-performance-report', { body: { status: 'success', data: { /* ...expected data... */ }} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-data')).toBeInTheDocument();
}, 10000);

test('Fails to generate inventory performance report due to server error. (from inventoryPerformanceReport_processPurchaseOrder)', async () => {
  fetchMock.post('/api/inventory-performance-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Processing a purchase order increases the stock level appropriately. (from inventoryPerformanceReport_processPurchaseOrder)', async () => {
  fetchMock.post('/api/purchase-order', { status: 200, body: { success: true, newStockLevel: 110 } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('orderInput'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitOrder')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('newStockLevel')).toHaveTextContent('110');
}, 10000);

test('Updates stock levels and order status correctly for backorders (from handleBackorders_setStockThresholds)', async () => {
  fetchMock.post('/api/backorders', { success: true, updatedStock: 80 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Process Backorder/i)); });

  expect(fetchMock.calls('/api/backorders').length).toBe(1);
  expect(screen.getByText(/Backorder processed. Updated Stock: 80/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when processing backorders (from handleBackorders_setStockThresholds)', async () => {
  fetchMock.post('/api/backorders', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Process Backorder/i)); });

  expect(fetchMock.calls('/api/backorders').length).toBe(1);
  expect(screen.getByText(/Error processing backorder/i)).toBeInTheDocument();
}, 10000);

test('Triggers alert on setting stock threshold successfully (from handleBackorders_setStockThresholds)', async () => {
  fetchMock.post('/api/stock/threshold', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Stock Threshold/i), { target: { value: 15 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Threshold/i)); });

  expect(fetchMock.calls('/api/stock/threshold').length).toBe(1);
  expect(screen.getByText(/Threshold set successfully/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when setting stock threshold (from handleBackorders_setStockThresholds)', async () => {
  fetchMock.post('/api/stock/threshold', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Stock Threshold/i), { target: { value: 15 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Threshold/i)); });

  expect(fetchMock.calls('/api/stock/threshold').length).toBe(1);
  expect(screen.getByText(/Error setting threshold/i)).toBeInTheDocument();
}, 10000);

