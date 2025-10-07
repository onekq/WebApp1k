import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayProductDetails_sortByPriceAsc_generateInvoice_validateCVV';

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

test('Generates invoice successfully (from generateInvoice_validateCVV)', async () => {
  fetchMock.get('/api/generateInvoice', { invoiceNumber: 'INV-12345' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Invoice')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invoice generated: INV-12345')).toBeInTheDocument();
}, 10000);

test('Fails to generate invoice (from generateInvoice_validateCVV)', async () => {
  fetchMock.get('/api/generateInvoice', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Invoice')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to generate invoice')).toBeInTheDocument();
}, 10000);

test('valid CVV (from generateInvoice_validateCVV)', async () => {
  fetchMock.post('/api/validate-cvv', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cvv-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('invalid CVV (from generateInvoice_validateCVV)', async () => {
  fetchMock.post('/api/validate-cvv', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cvv-input'), { target: { value: '12A' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid CVV')).toBeInTheDocument();
}, 10000);

