import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './searchProductByName_setStockThresholds_trackInventoryByLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Searching for a product by name returns the correct product.', async () => {
  fetchMock.get('/products?name=Existing Product', { products: [{ id: 1, name: 'Existing Product' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/search by name/i), { target: { value: 'Existing Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/search/i)); });

  expect(fetchMock.calls('/products?name=Existing Product')).toHaveLength(1);
  expect(screen.getByText(/existing product/i)).toBeInTheDocument();
}, 10000);

test('Searching for a product by name handles no results correctly.', async () => {
  fetchMock.get('/products?name=Nonexistent Product', { products: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/search by name/i), { target: { value: 'Nonexistent Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/search/i)); });

  expect(fetchMock.calls('/products?name=Nonexistent Product')).toHaveLength(1);
  expect(screen.getByText(/no products found/i)).toBeInTheDocument();
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
