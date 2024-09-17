import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './paginateProductListings_processPayPalApp';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('paginates product listings successfully', async () => {
  fetchMock.get('/api/products?page=2', { products: [{ id: 2, name: 'Product 2' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('page-2')); });

  expect(fetchMock.called('/api/products?page=2')).toBe(true);
  expect(screen.getByText('Product 2')).toBeInTheDocument();
}, 10000);

test('fails to paginate product listings and shows error', async () => {
  fetchMock.get('/api/products?page=2', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('page-2')); });

  expect(fetchMock.called('/api/products?page=2')).toBe(true);
  expect(screen.getByText('Error loading products')).toBeInTheDocument();
}, 10000);

test('process PayPal payment successfully', async () => {
  fetchMock.post('/api/process-paypal-payment', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-paypal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process PayPal payment', async () => {
  fetchMock.post('/api/process-paypal-payment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-paypal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);