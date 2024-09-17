import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addNewSupplier_searchProductBySKU';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully adds a new supplier.', async () => {
  fetchMock.post('/api/suppliers', { status: 201, body: { id: 1, name: 'New Supplier' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.change(screen.getByTestId('supplier-name'), { target: { value: 'New Supplier' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-supplier-button')); });

  expect(fetchMock.called('/api/suppliers')).toBe(true);
  expect(screen.getByText('New Supplier')).toBeInTheDocument();
}, 10000);

test('Fails to add a new supplier with server error.', async () => {
  fetchMock.post('/api/suppliers', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.change(screen.getByTestId('supplier-name'), { target: { value: 'New Supplier' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-supplier-button')); });

  expect(fetchMock.called('/api/suppliers')).toBe(true);
  expect(screen.getByText('Failed to add supplier')).toBeInTheDocument();
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