import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './generateSupplierPerformanceReport_trackDamagedStock_trackPurchaseOrders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully generates supplier performance report.', async () => {
  fetchMock.get('/api/suppliers/1/report', { status: 200, body: { report: 'Performance Report Data' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.called('/api/suppliers/1/report')).toBe(true);
  expect(screen.getByText('Performance Report Data')).toBeInTheDocument();
}, 10000);

test('Fails to generate supplier performance report.', async () => {
  fetchMock.get('/api/suppliers/1/report', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.called('/api/suppliers/1/report')).toBe(true);
  expect(screen.getByText('Failed to generate report')).toBeInTheDocument();
}, 10000);

test('Updates inventory and status correctly for damaged stock', async () => {
  fetchMock.post('/api/stock/damaged', { success: true, updatedStock: 60 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report Damaged Stock/i)); });

  expect(fetchMock.calls('/api/stock/damaged').length).toBe(1);
  expect(screen.getByText(/Damaged stock reported. Updated Stock: 60/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when reporting damaged stock', async () => {
  fetchMock.post('/api/stock/damaged', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report Damaged Stock/i)); });

  expect(fetchMock.calls('/api/stock/damaged').length).toBe(1);
  expect(screen.getByText(/Error reporting damaged stock/i)).toBeInTheDocument();
}, 10000);

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
