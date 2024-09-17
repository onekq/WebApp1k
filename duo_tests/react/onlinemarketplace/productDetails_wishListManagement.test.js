import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './productDetails_wishListManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Product details retrieval and display succeed.', async () => {
  fetchMock.get('/api/products/1', { status: 200, body: { id: 1, name: 'Sample Product' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/products/1').length).toBe(1);
  expect(screen.getByText('Sample Product')).toBeInTheDocument();
}, 10000);

test('Product details retrieval fails with error message.', async () => {
  fetchMock.get('/api/products/1', { status: 404, body: { message: 'Product not found' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/products/1').length).toBe(1);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);

test('Wish List Management success adds item to wish list', async () => {
  fetchMock.post('/api/wishlist', { id: 1, product: 'Product 1' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add to Wish List')); });

  expect(fetchMock.calls('/api/wishlist').length).toBe(1);
  expect(screen.getByText('Product 1 added to wish list')).toBeInTheDocument();
}, 10000);

test('Wish List Management failure shows error message', async () => {
  fetchMock.post('/api/wishlist', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add to Wish List')); });

  expect(screen.getByText('Error adding to wish list')).toBeInTheDocument();
}, 10000);