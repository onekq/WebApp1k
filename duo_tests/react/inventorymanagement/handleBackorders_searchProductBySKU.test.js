import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './handleBackorders_searchProductBySKU';

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

test('Searching for a product by SKU returns the correct product.', async () => {
  fetchMock.get('/products?sku=12345', { products: [{ id: 1, sku: '12345', name: 'Product by SKU' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/search by sku/i), { target: { value: '12345' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/search/i)); });

  expect(fetchMock.calls('/products?sku=12345')).toHaveLength(1);
  expect(screen.getByText(/product by sku/i)).toBeInTheDocument();
}, 10000);

test('Searching for a product by SKU handles no results correctly.', async () => {
  fetchMock.get('/products?sku=nonexistent', { products: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/search by sku/i), { target: { value: 'nonexistent' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/search/i)); });

  expect(fetchMock.calls('/products?sku=nonexistent')).toHaveLength(1);
  expect(screen.getByText(/no products found/i)).toBeInTheDocument();
}, 10000);