import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './placeOrder_removeFromWishList_addToCart_productInventoryManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('places an order successfully. (from placeOrder_removeFromWishList)', async () => {
  fetchMock.post('/api/order', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Place Order')); });

  expect(fetchMock.calls('/api/order').length).toEqual(1);
  expect(screen.getByText('Order placed successfully')).toBeInTheDocument();
}, 10000);

test('displays error on failing to place order. (from placeOrder_removeFromWishList)', async () => {
  fetchMock.post('/api/order', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Place Order')); });

  expect(fetchMock.calls('/api/order').length).toEqual(1);
  expect(screen.getByText('Order placement failed')).toBeInTheDocument();
}, 10000);

test('Remove from Wish List success removes item from wish list (from placeOrder_removeFromWishList)', async () => {
  fetchMock.delete('/api/wishlist/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Wish List')); });

  expect(fetchMock.calls('/api/wishlist/1').length).toBe(1);
  expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
}, 10000);

test('Remove from Wish List failure shows error message (from placeOrder_removeFromWishList)', async () => {
  fetchMock.delete('/api/wishlist/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Wish List')); });

  expect(screen.getByText('Error removing from wish list')).toBeInTheDocument();
}, 10000);

test('Adding a product to the cart succeeds. (from addToCart_productInventoryManagement)', async () => {
  fetchMock.post('/api/cart', { status: 200, body: { message: 'Added to cart successfully' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add to Cart')); });

  expect(fetchMock.calls('/api/cart').length).toBe(1);
  expect(screen.getByText('Added to cart successfully')).toBeInTheDocument();
}, 10000);

test('Adding a product to the cart fails with error message. (from addToCart_productInventoryManagement)', async () => {
  fetchMock.post('/api/cart', { status: 400, body: { message: 'Product out of stock' } });

  await act(async () => { render(<MemoryRouter><App productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add to Cart')); });

  expect(fetchMock.calls('/api/cart').length).toBe(1);
  expect(screen.getByText('Product out of stock')).toBeInTheDocument();
}, 10000);

test('Inventory management for sellers succeeds. (from addToCart_productInventoryManagement)', async () => {
  fetchMock.get('/api/seller/inventory', { status: 200, body: [{ id: 1, name: 'Sample Product', stock: 15 }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/seller/inventory').length).toBe(1);
  expect(screen.getByText('Sample Product')).toBeInTheDocument();
}, 10000);

test('Inventory management fails with error message. (from addToCart_productInventoryManagement)', async () => {
  fetchMock.get('/api/seller/inventory', { status: 500, body: { message: 'Internal server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/seller/inventory').length).toBe(1);
  expect(screen.getByText('Internal server error')).toBeInTheDocument();
}, 10000);

