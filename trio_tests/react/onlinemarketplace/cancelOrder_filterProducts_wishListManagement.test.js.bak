import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './cancelOrder_filterProducts_wishListManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Cancel Order success removes order from list', async () => {
  fetchMock.delete('/api/orders/1', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Cancel Order')); });

  expect(fetchMock.calls('/api/orders/1').length).toBe(1);
  expect(screen.queryByText('Order 1')).not.toBeInTheDocument();
}, 10000);

test('Cancel Order failure shows error message', async () => {
  fetchMock.delete('/api/orders/1', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Cancel Order')); });

  expect(screen.getByText('Error cancelling order')).toBeInTheDocument();
}, 10000);

test('Filter Products successfully filters products.', async () => {
  fetchMock.get('/api/filter', { status: 200, body: { results: ['Filtered Product 1'] } });

  await act(async () => { render(<MemoryRouter><FilterProducts /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-category')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Filtered Product 1')).toBeInTheDocument();
}, 10000);

test('Filter Products fails and displays error message.', async () => {
  fetchMock.get('/api/filter', { status: 500 });

  await act(async () => { render(<MemoryRouter><FilterProducts /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-category')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to apply filters')).toBeInTheDocument();
}, 10000);

test('Wish List Management success adds item to wish list', async () => {
  fetchMock.post('/api/wishlist', { id: 1, product: 'Product 1' });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add to Wish List')); });

  expect(fetchMock.calls('/api/wishlist').length).toBe(1);
  expect(screen.getByText('Product 1 added to wish list')).toBeInTheDocument();
}, 10000);

test('Wish List Management failure shows error message', async () => {
  fetchMock.post('/api/wishlist', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add to Wish List')); });

  expect(screen.getByText('Error adding to wish list')).toBeInTheDocument();
}, 10000);
