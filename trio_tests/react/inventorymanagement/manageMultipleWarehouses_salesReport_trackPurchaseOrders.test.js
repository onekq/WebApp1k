import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './manageMultipleWarehouses_salesReport_trackPurchaseOrders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Reflects correct stock levels per warehouse on success', async () => {
  fetchMock.get('/api/warehouses', { warehouse1: 100, warehouse2: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/warehouses').length).toBe(1);
  expect(screen.getByText(/Warehouse1: 100/i)).toBeInTheDocument();
  expect(screen.getByText(/Warehouse2: 200/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when fetching warehouse data', async () => {
  fetchMock.get('/api/warehouses', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/warehouses').length).toBe(1);
  expect(screen.getByText(/Error fetching warehouse data/i)).toBeInTheDocument();
}, 10000);

test('Generates sales report successfully.', async () => {
  fetchMock.post('/api/sales-report', { body: { status: 'success', data: { /* ...expected data... */ }} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-data')).toBeInTheDocument();
}, 10000);

test('Fails to generate sales report due to server error.', async () => {
  fetchMock.post('/api/sales-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Validate tracking purchase orders shows all relevant orders correctly.', async () => {
  fetchMock.get('/api/purchase-orders', { status: 200, body: { orders: [{ id: 1, item: 'Product B', quantity: 10 }] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackPurchaseOrders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product B')).toBeInTheDocument();
}, 10000);

test('Tracking purchase orders doesn\'t show orders due to error.', async () => {
  fetchMock.get('/api/purchase-orders', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackPurchaseOrders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching purchase orders.')).toBeInTheDocument();
}, 10000);
