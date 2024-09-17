import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addToCart_productApp';

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

test('Inventory management for sellers succeeds.', async () => {
  fetchMock.get('/api/seller/inventory', { status: 200, body: [{ id: 1, name: 'Sample Product', stock: 15 }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/seller/inventory').length).toBe(1);
  expect(screen.getByText('Sample Product')).toBeInTheDocument();
}, 10000);

test('Inventory management fails with error message.', async () => {
  fetchMock.get('/api/seller/inventory', { status: 500, body: { message: 'Internal server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/seller/inventory').length).toBe(1);
  expect(screen.getByText('Internal server error')).toBeInTheDocument();
}, 10000);