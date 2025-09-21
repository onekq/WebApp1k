import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editProductDetails_manageStockTransfers_trackInventoryByLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Editing product details updates the inventory list accurately.', async () => {
  fetchMock.put('/products/1', { id: 1, name: 'Updated Product' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Updated Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/save changes/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/updated product/i)).toBeInTheDocument();
}, 10000);

test('Editing product details shows an error message if the update fails.', async () => {
  fetchMock.put('/products/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Updated Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/save changes/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/error saving changes/i)).toBeInTheDocument();
}, 10000);

test('Updates stock levels after stock transfer', async () => {
  fetchMock.post('/api/stock/transfer', { success: true, updatedStock: 70 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Transfer Stock/i)); });

  expect(fetchMock.calls('/api/stock/transfer').length).toBe(1);
  expect(screen.getByText(/Stock transferred. Updated Stock: 70/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when transferring stock', async () => {
  fetchMock.post('/api/stock/transfer', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Transfer Stock/i)); });

  expect(fetchMock.calls('/api/stock/transfer').length).toBe(1);
  expect(screen.getByText(/Error transferring stock/i)).toBeInTheDocument();
}, 10000);

test('Shows accurate stock levels per location', async () => {
  fetchMock.get('/api/inventory/location', { location1: 30, location2: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/inventory/location').length).toBe(1);
  expect(screen.getByText(/Location1: 30/i)).toBeInTheDocument();
  expect(screen.getByText(/Location2: 50/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when fetching inventory by location', async () => {
  fetchMock.get('/api/inventory/location', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/inventory/location').length).toBe(1);
  expect(screen.getByText(/Error fetching inventory by location/i)).toBeInTheDocument();
}, 10000);
