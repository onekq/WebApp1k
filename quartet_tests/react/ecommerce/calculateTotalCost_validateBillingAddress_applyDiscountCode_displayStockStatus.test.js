import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateTotalCost_validateBillingAddress_applyDiscountCode_displayStockStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculateTotalCost: successfully display total cost including all charges (from calculateTotalCost_validateBillingAddress)', async () => {
  fetchMock.get('/api/cart/total', { status: 200, body: { total: '123.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Total: $123.00')).toBeInTheDocument();  
}, 10000);

test('calculateTotalCost: fail to display total cost with error message (from calculateTotalCost_validateBillingAddress)', async () => {
  fetchMock.get('/api/cart/total', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate total cost')).toBeInTheDocument();  
}, 10000);

test('Validates billing address successfully (from calculateTotalCost_validateBillingAddress)', async () => {
  fetchMock.post('/api/validateBillingAddress', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Billing Address'), { target: { value: '456 Elm St' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Billing')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Billing address validated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to validate billing address with invalid data (from calculateTotalCost_validateBillingAddress)', async () => {
  fetchMock.post('/api/validateBillingAddress', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Billing Address'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Billing')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid billing address')).toBeInTheDocument();
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

