import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './placeOrder_productInventoryManagement_sortProducts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('places an order successfully.', async () => {
  fetchMock.post('/api/order', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Place Order')); });

  expect(fetchMock.calls('/api/order').length).toEqual(1);
  expect(screen.getByText('Order placed successfully')).toBeInTheDocument();
}, 10000);

test('displays error on failing to place order.', async () => {
  fetchMock.post('/api/order', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Place Order')); });

  expect(fetchMock.calls('/api/order').length).toEqual(1);
  expect(screen.getByText('Order placement failed')).toBeInTheDocument();
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

test('Sort Products successfully sorts products.', async () => {
  fetchMock.get('/api/sort', { status: 200, body: { results: ['Product A', 'Product B'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product A')).toBeInTheDocument();
}, 10000);

test('Sort Products fails and displays error message.', async () => {
  fetchMock.get('/api/sort', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort products')).toBeInTheDocument();
}, 10000);
