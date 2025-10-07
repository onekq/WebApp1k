import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayProductDetails_sortByPriceAsc_processBankTransferPayment_updateProductStock';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('displays product details successfully (from displayProductDetails_sortByPriceAsc)', async () => {
  fetchMock.get('/api/products/1', { id: 1, name: 'Product 1', description: 'A great product', price: 100, rating: 4 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('A great product')).toBeInTheDocument();
}, 10000);

test('fails to display product details and shows error (from displayProductDetails_sortByPriceAsc)', async () => {
  fetchMock.get('/api/products/1', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);

test('sorts by price ascending successfully (from displayProductDetails_sortByPriceAsc)', async () => {
  fetchMock.get('/api/products?sort=price_asc', { products: [{ id: 1, name: 'Budget Phone' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-price-asc')); });

  expect(fetchMock.called('/api/products?sort=price_asc')).toBe(true);
  expect(screen.getByText('Budget Phone')).toBeInTheDocument();
}, 10000);

test('fails to sort by price ascending and shows error (from displayProductDetails_sortByPriceAsc)', async () => {
  fetchMock.get('/api/products?sort=price_asc', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-price-asc')); });

  expect(fetchMock.called('/api/products?sort=price_asc')).toBe(true);
  expect(screen.getByText('Error sorting products')).toBeInTheDocument();
}, 10000);

test('process bank transfer payment successfully (from processBankTransferPayment_updateProductStock)', async () => {
  fetchMock.post('/api/process-bank-transfer', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-bank-transfer-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process bank transfer payment (from processBankTransferPayment_updateProductStock)', async () => {
  fetchMock.post('/api/process-bank-transfer', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-bank-transfer-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);

test('Updates product stock successfully (from processBankTransferPayment_updateProductStock)', async () => {
  fetchMock.patch('/api/updateProductStock', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Update Product Stock')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Product stock updated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to update product stock (from processBankTransferPayment_updateProductStock)', async () => {
  fetchMock.patch('/api/updateProductStock', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Update Product Stock')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update product stock')).toBeInTheDocument();
}, 10000);

