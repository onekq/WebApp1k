import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addToCart_checkoutProcess_filterProducts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Adding a product to the cart succeeds.', async () => {
  fetchMock.post('/api/cart', { status: 200, body: { message: 'Added to cart successfully' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add to Cart')); });

  expect(fetchMock.calls('/api/cart').length).toBe(1);
  expect(screen.getByText('Added to cart successfully')).toBeInTheDocument();
}, 10000);

test('Adding a product to the cart fails with error message.', async () => {
  fetchMock.post('/api/cart', { status: 400, body: { message: 'Product out of stock' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add to Cart')); });

  expect(fetchMock.calls('/api/cart').length).toBe(1);
  expect(screen.getByText('Product out of stock')).toBeInTheDocument();
}, 10000);

test('validates checkout steps successfully.', async () => {
  fetchMock.post('/api/checkout', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Proceed to Checkout')); });

  expect(fetchMock.calls('/api/checkout').length).toEqual(1);
  expect(screen.getByText('Checkout Completed')).toBeInTheDocument();
}, 10000);

test('displays error on checkout step failure.', async () => {
  fetchMock.post('/api/checkout', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Proceed to Checkout')); });

  expect(fetchMock.calls('/api/checkout').length).toEqual(1);
  expect(screen.getByText('Checkout failed')).toBeInTheDocument();
}, 10000);

test('Filter Products successfully filters products.', async () => {
  fetchMock.get('/api/filter', { status: 200, body: { results: ['Filtered Product 1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-category')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Filtered Product 1')).toBeInTheDocument();
}, 10000);

test('Filter Products fails and displays error message.', async () => {
  fetchMock.get('/api/filter', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-category')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to apply filters')).toBeInTheDocument();
}, 10000);
