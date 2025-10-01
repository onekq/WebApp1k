import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './handleBackorders_manageMultipleWarehouses_setStockThresholds';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Updates stock levels and order status correctly for backorders', async () => {
  fetchMock.post('/api/backorders', { success: true, updatedStock: 80 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Process Backorder/i)); });

  expect(fetchMock.calls('/api/backorders').length).toBe(1);
  expect(screen.getByText(/Backorder processed. Updated Stock: 80/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when processing backorders', async () => {
  fetchMock.post('/api/backorders', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Process Backorder/i)); });

  expect(fetchMock.calls('/api/backorders').length).toBe(1);
  expect(screen.getByText(/Error processing backorder/i)).toBeInTheDocument();
}, 10000);

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

test('Triggers alert on setting stock threshold successfully', async () => {
  fetchMock.post('/api/stock/threshold', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Stock Threshold/i), { target: { value: 15 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Threshold/i)); });

  expect(fetchMock.calls('/api/stock/threshold').length).toBe(1);
  expect(screen.getByText(/Threshold set successfully/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when setting stock threshold', async () => {
  fetchMock.post('/api/stock/threshold', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Stock Threshold/i), { target: { value: 15 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Threshold/i)); });

  expect(fetchMock.calls('/api/stock/threshold').length).toBe(1);
  expect(screen.getByText(/Error setting threshold/i)).toBeInTheDocument();
}, 10000);
