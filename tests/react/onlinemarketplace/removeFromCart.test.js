import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CartPage from './removeFromCart';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Removing a product from the cart succeeds.', async () => {
  fetchMock.delete('/api/cart/1', { status: 200, body: { message: 'Removed from cart successfully' } });

  await act(async () => { render(<MemoryRouter><CartPage /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Cart')); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Removed from cart successfully')).toBeInTheDocument();
}, 10000);

test('Removing a product from the cart fails with error message.', async () => {
  fetchMock.delete('/api/cart/1', { status: 400, body: { message: 'Failed to remove from cart' } });

  await act(async () => { render(<MemoryRouter><CartPage /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Cart')); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Failed to remove from cart')).toBeInTheDocument();
}, 10000);

