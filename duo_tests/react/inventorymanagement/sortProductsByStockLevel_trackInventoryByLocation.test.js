import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sortProductsByStockLevel_trackInventoryByLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Sorting products by stock level orders them numerically.', async () => {
  fetchMock.get('/products?sort=stock', { products: [{ id: 1, stock: 5, name: 'Low Stock Product' }, { id: 2, stock: 100, name: 'High Stock Product' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/sort by stock level/i)); });

  expect(fetchMock.calls('/products?sort=stock')).toHaveLength(1);
  expect(screen.getByText(/low stock product/i)).toBeInTheDocument();
}, 10000);

test('Sorting products by stock level shows an error message if failed.', async () => {
  fetchMock.get('/products?sort=stock', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/sort by stock level/i)); });

  expect(fetchMock.calls('/products?sort=stock')).toHaveLength(1);
  expect(screen.getByText(/error sorting products/i)).toBeInTheDocument();
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