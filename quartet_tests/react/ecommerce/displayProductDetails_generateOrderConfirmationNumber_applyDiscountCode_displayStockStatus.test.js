import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayProductDetails_generateOrderConfirmationNumber_applyDiscountCode_displayStockStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('displays product details successfully (from displayProductDetails_generateOrderConfirmationNumber)', async () => {
  fetchMock.get('/api/products/1', { id: 1, name: 'Product 1', description: 'A great product', price: 100, rating: 4 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('A great product')).toBeInTheDocument();
}, 10000);

test('fails to display product details and shows error (from displayProductDetails_generateOrderConfirmationNumber)', async () => {
  fetchMock.get('/api/products/1', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);

test('Generates order confirmation number successfully (from displayProductDetails_generateOrderConfirmationNumber)', async () => {
  fetchMock.get('/api/generateOrderConfirmationNumber', { confirmationNumber: '123456' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Confirmation Number')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Order confirmation number: 123456')).toBeInTheDocument();
}, 10000);

test('Fails to generate order confirmation number (from displayProductDetails_generateOrderConfirmationNumber)', async () => {
  fetchMock.get('/api/generateOrderConfirmationNumber', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Confirmation Number')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to generate order confirmation number')).toBeInTheDocument();
}, 10000);

test('applyDiscountCode: successfully apply discount code to cart (from applyDiscountCode_displayStockStatus)', async () => {
  fetchMock.post('/api/cart/discount', { status: 200, body: { message: 'Discount Applied' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code'), { target: { value: 'DISCOUNT2023' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-discount')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Discount Applied successfully')).toBeInTheDocument();  
}, 10000);

test('applyDiscountCode: fail to apply discount code to cart with error message (from applyDiscountCode_displayStockStatus)', async () => {
  fetchMock.post('/api/cart/discount', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code'), { target: { value: 'DISCOUNT2023' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-discount')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to apply discount')).toBeInTheDocument();  
}, 10000);

test('displays product stock status successfully (from applyDiscountCode_displayStockStatus)', async () => {
  fetchMock.get('/api/products/1', { id: 1, name: 'Product 1', stock: 'In Stock' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('In Stock')).toBeInTheDocument();
}, 10000);

test('fails to display product stock status and shows error (from applyDiscountCode_displayStockStatus)', async () => {
  fetchMock.get('/api/products/1', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);

