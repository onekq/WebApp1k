import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editProductDetails_setStockThresholds_filterProductsByCategory_searchProductBySKU';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Editing product details updates the inventory list accurately. (from editProductDetails_setStockThresholds)', async () => {
  fetchMock.put('/products/1', { id: 1, name: 'Updated Product' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Updated Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/save changes/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/updated product/i)).toBeInTheDocument();
}, 10000);

test('Editing product details shows an error message if the update fails. (from editProductDetails_setStockThresholds)', async () => {
  fetchMock.put('/products/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Updated Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/save changes/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/error saving changes/i)).toBeInTheDocument();
}, 10000);

test('Triggers alert on setting stock threshold successfully (from editProductDetails_setStockThresholds)', async () => {
  fetchMock.post('/api/stock/threshold', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Stock Threshold/i), { target: { value: 15 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Threshold/i)); });

  expect(fetchMock.calls('/api/stock/threshold').length).toBe(1);
  expect(screen.getByText(/Threshold set successfully/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when setting stock threshold (from editProductDetails_setStockThresholds)', async () => {
  fetchMock.post('/api/stock/threshold', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Stock Threshold/i), { target: { value: 15 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Threshold/i)); });

  expect(fetchMock.calls('/api/stock/threshold').length).toBe(1);
  expect(screen.getByText(/Error setting threshold/i)).toBeInTheDocument();
}, 10000);

test('Filtering products by category shows only relevant products. (from filterProductsByCategory_searchProductBySKU)', async () => {
  fetchMock.get('/products?category=Category1', { products: [{ id: 1, category: 'Category1', name: 'Product1' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/filter by category/i), { target: { value: 'Category1' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/filter/i)); });

  expect(fetchMock.calls('/products?category=Category1')).toHaveLength(1);
  expect(screen.getByText(/product1/i)).toBeInTheDocument();
}, 10000);

test('Filtering products by category shows a message if no products are found. (from filterProductsByCategory_searchProductBySKU)', async () => {
  fetchMock.get('/products?category=NoCategory', { products: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/filter by category/i), { target: { value: 'NoCategory' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/filter/i)); });

  expect(fetchMock.calls('/products?category=NoCategory')).toHaveLength(1);
  expect(screen.getByText(/no products found/i)).toBeInTheDocument();
}, 10000);

test('Searching for a product by SKU returns the correct product. (from filterProductsByCategory_searchProductBySKU)', async () => {
  fetchMock.get('/products?sku=12345', { products: [{ id: 1, sku: '12345', name: 'Product by SKU' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/search by sku/i), { target: { value: '12345' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/search/i)); });

  expect(fetchMock.calls('/products?sku=12345')).toHaveLength(1);
  expect(screen.getByText(/product by sku/i)).toBeInTheDocument();
}, 10000);

test('Searching for a product by SKU handles no results correctly. (from filterProductsByCategory_searchProductBySKU)', async () => {
  fetchMock.get('/products?sku=nonexistent', { products: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/search by sku/i), { target: { value: 'nonexistent' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/search/i)); });

  expect(fetchMock.calls('/products?sku=nonexistent')).toHaveLength(1);
  expect(screen.getByText(/no products found/i)).toBeInTheDocument();
}, 10000);

