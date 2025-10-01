import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateShippingCost_displayProductDetails_verifyPaymentConfirmation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('calculateShippingCost: successfully calculate shipping costs', async () => {
  fetchMock.get('/api/cart/shipping', { status: 200, body: { shipping: '15.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Shipping: $15.00')).toBeInTheDocument();  
}, 10000);

test('calculateShippingCost: fail to calculate shipping costs with error message', async () => {
  fetchMock.get('/api/cart/shipping', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate shipping')).toBeInTheDocument();  
}, 10000);

test('displays product details successfully', async () => {
  fetchMock.get('/api/products/1', { id: 1, name: 'Product 1', description: 'A great product', price: 100, rating: 4 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('A great product')).toBeInTheDocument();
}, 10000);

test('fails to display product details and shows error', async () => {
  fetchMock.get('/api/products/1', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);

test('verify payment confirmation successfully', async () => {
  fetchMock.get('/api/verify-payment-confirmation', { confirmed: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('verify-payment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment confirmed')).toBeInTheDocument();
}, 10000);

test('fail to confirm payment', async () => {
  fetchMock.get('/api/verify-payment-confirmation', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('verify-payment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to confirm payment')).toBeInTheDocument();
}, 10000);
