import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './updateCartQuantity_viewOrderHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Updating the quantity of a product in the cart succeeds.', async () => {
  fetchMock.put('/api/cart/1', { status: 200, body: { message: 'Quantity updated successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '2' } }); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Quantity updated successfully')).toBeInTheDocument();
}, 10000);

test('Updating the quantity of a product in the cart fails with error message.', async () => {
  fetchMock.put('/api/cart/1', { status: 400, body: { message: 'Invalid quantity' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '-1' } }); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Invalid quantity')).toBeInTheDocument();
}, 10000);

test('View Order History success shows order data', async () => {
  fetchMock.get('/api/orders', [{ id: 1, product: 'Product 1' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  expect(fetchMock.calls('/api/orders').length).toBe(1);
  
  expect(screen.getByText('Product 1')).toBeInTheDocument();
}, 10000);

test('View Order History failure shows error message', async () => {
  fetchMock.get('/api/orders', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(screen.getByText('Error loading order history')).toBeInTheDocument();
}, 10000);