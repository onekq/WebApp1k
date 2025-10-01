import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayAverageRating_displayStockStatus_processPayPalPayment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Displaying average product rating should show correct value', async () => {
  fetchMock.get('/api/reviews/average?productId=123', { averageRating: 4.5 });

  await act(async () => { render(<MemoryRouter><DisplayAverageRating productId="123" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews/average?productId=123')).toHaveLength(1);
  expect(screen.getByText('Average Rating: 4.5')).toBeInTheDocument();
}, 10000);

test('Displaying average product rating should fail to fetch data', async () => {
  fetchMock.get('/api/reviews/average?productId=123', { status: 500 });

  await act(async () => { render(<MemoryRouter><DisplayAverageRating productId="123" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews/average?productId=123')).toHaveLength(1);
  expect(screen.getByText('Failed to load average rating')).toBeInTheDocument();
}, 10000);

test('displays product stock status successfully', async () => {
  fetchMock.get('/api/products/1', { id: 1, name: 'Product 1', stock: 'In Stock' });

  await act(async () => { render(<MemoryRouter><Products /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('In Stock')).toBeInTheDocument();
}, 10000);

test('fails to display product stock status and shows error', async () => {
  fetchMock.get('/api/products/1', 404);

  await act(async () => { render(<MemoryRouter><Products /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);

test('process PayPal payment successfully', async () => {
  fetchMock.post('/api/process-paypal-payment', { success: true });

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-paypal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process PayPal payment', async () => {
  fetchMock.post('/api/process-paypal-payment', 500);

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-paypal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);
