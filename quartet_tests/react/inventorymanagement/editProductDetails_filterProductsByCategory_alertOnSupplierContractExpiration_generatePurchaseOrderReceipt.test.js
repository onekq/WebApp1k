import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editProductDetails_filterProductsByCategory_alertOnSupplierContractExpiration_generatePurchaseOrderReceipt';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Editing product details updates the inventory list accurately. (from editProductDetails_filterProductsByCategory)', async () => {
  fetchMock.put('/products/1', { id: 1, name: 'Updated Product' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Updated Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/save changes/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/updated product/i)).toBeInTheDocument();
}, 10000);

test('Editing product details shows an error message if the update fails. (from editProductDetails_filterProductsByCategory)', async () => {
  fetchMock.put('/products/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Updated Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/save changes/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/error saving changes/i)).toBeInTheDocument();
}, 10000);

test('Filtering products by category shows only relevant products. (from editProductDetails_filterProductsByCategory)', async () => {
  fetchMock.get('/products?category=Category1', { products: [{ id: 1, category: 'Category1', name: 'Product1' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/filter by category/i), { target: { value: 'Category1' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/filter/i)); });

  expect(fetchMock.calls('/products?category=Category1')).toHaveLength(1);
  expect(screen.getByText(/product1/i)).toBeInTheDocument();
}, 10000);

test('Filtering products by category shows a message if no products are found. (from editProductDetails_filterProductsByCategory)', async () => {
  fetchMock.get('/products?category=NoCategory', { products: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/filter by category/i), { target: { value: 'NoCategory' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/filter/i)); });

  expect(fetchMock.calls('/products?category=NoCategory')).toHaveLength(1);
  expect(screen.getByText(/no products found/i)).toBeInTheDocument();
}, 10000);

test('Successfully alerts on supplier contract expiration. (from alertOnSupplierContractExpiration_generatePurchaseOrderReceipt)', async () => {
  fetchMock.get('/api/suppliers/1/contract-expiration', { status: 200, body: { message: 'Contract is about to expire' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('check-contract-expiration-button')); });

  expect(fetchMock.called('/api/suppliers/1/contract-expiration')).toBe(true);
  expect(screen.getByText('Contract is about to expire')).toBeInTheDocument();
}, 10000);

test('Fails to alert on supplier contract expiration. (from alertOnSupplierContractExpiration_generatePurchaseOrderReceipt)', async () => {
  fetchMock.get('/api/suppliers/1/contract-expiration', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('check-contract-expiration-button')); });

  expect(fetchMock.called('/api/suppliers/1/contract-expiration')).toBe(true);
  expect(screen.getByText('Failed to check contract expiration')).toBeInTheDocument();
}, 10000);

test('Ensure generating a purchase order receipt includes all relevant details. (from alertOnSupplierContractExpiration_generatePurchaseOrderReceipt)', async () => {
  fetchMock.get('/api/purchase-receipt', { status: 200, body: { receipt: { id: 1, total: 200, items: [{ item: 'Product B', quantity: 10 }] } } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generateReceipt')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product B')).toBeInTheDocument();
  expect(screen.getByText('200')).toBeInTheDocument();
}, 10000);

