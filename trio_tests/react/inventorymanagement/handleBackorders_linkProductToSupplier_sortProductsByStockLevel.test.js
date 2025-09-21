import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './handleBackorders_linkProductToSupplier_sortProductsByStockLevel';

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

test('Successfully links a product to supplier.', async () => {
  fetchMock.post('/api/products/link', { status: 200, body: { productId: 1, supplierId: 1, linked: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('link-product-button')); });

  expect(fetchMock.called('/api/products/link')).toBe(true);
  expect(screen.getByText('Product linked to supplier successfully')).toBeInTheDocument();
}, 10000);

test('Fails to link product to supplier.', async () => {
  fetchMock.post('/api/products/link', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('link-product-button')); });

  expect(fetchMock.called('/api/products/link')).toBe(true);
  expect(screen.getByText('Failed to link product to supplier')).toBeInTheDocument();
}, 10000);

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
