import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayAverageRating_updateCartQuantity_filterByCategory_processPayPalPayment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displaying average product rating should show correct value (from displayAverageRating_updateCartQuantity)', async () => {
  fetchMock.get('/api/reviews/average?productId=123', { averageRating: 4.5 });

  await act(async () => { render(<MemoryRouter><App productId="123" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews/average?productId=123')).toHaveLength(1);
  expect(screen.getByText('Average Rating: 4.5')).toBeInTheDocument();
}, 10000);

test('Displaying average product rating should fail to fetch data (from displayAverageRating_updateCartQuantity)', async () => {
  fetchMock.get('/api/reviews/average?productId=123', { status: 500 });

  await act(async () => { render(<MemoryRouter><App productId="123" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews/average?productId=123')).toHaveLength(1);
  expect(screen.getByText('Failed to load average rating')).toBeInTheDocument();
}, 10000);

test('updateCartQuantity: successfully update product quantity in cart (from displayAverageRating_updateCartQuantity)', async () => {
  fetchMock.put('/api/cart/1', { status: 200, body: { message: 'Updated' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cart-quantity'), { target: { value: '3' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-quantity')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Quantity updated successfully')).toBeInTheDocument();  
}, 10000);

test('updateCartQuantity: fail to update product quantity in cart with error message (from displayAverageRating_updateCartQuantity)', async () => {
  fetchMock.put('/api/cart/1', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cart-quantity'), { target: { value: '3' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-quantity')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update quantity')).toBeInTheDocument();  
}, 10000);

test('filters by category successfully (from filterByCategory_processPayPalPayment)', async () => {
  fetchMock.get('/api/products?category=electronics', { products: [{ id: 1, name: 'TV' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('category-filter'), { target: { value: 'electronics' } }); });

  expect(fetchMock.called('/api/products?category=electronics')).toBe(true);
  expect(screen.getByText('TV')).toBeInTheDocument();
}, 10000);

test('fails to filter by category and shows error (from filterByCategory_processPayPalPayment)', async () => {
  fetchMock.get('/api/products?category=unknown', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('category-filter'), { target: { value: 'unknown' } }); });

  expect(fetchMock.called('/api/products?category=unknown')).toBe(true);
  expect(screen.getByText('No products found')).toBeInTheDocument();
}, 10000);

test('process PayPal payment successfully (from filterByCategory_processPayPalPayment)', async () => {
  fetchMock.post('/api/process-paypal-payment', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-paypal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process PayPal payment (from filterByCategory_processPayPalPayment)', async () => {
  fetchMock.post('/api/process-paypal-payment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-paypal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);

