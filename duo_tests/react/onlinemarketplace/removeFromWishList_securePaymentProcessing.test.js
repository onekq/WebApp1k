import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removeFromWishList_securePaymentProcessing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Remove from Wish List success removes item from wish list', async () => {
  fetchMock.delete('/api/wishlist/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Wish List')); });

  expect(fetchMock.calls('/api/wishlist/1').length).toBe(1);
  expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
}, 10000);

test('Remove from Wish List failure shows error message', async () => {
  fetchMock.delete('/api/wishlist/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Wish List')); });

  expect(screen.getByText('Error removing from wish list')).toBeInTheDocument();
}, 10000);

test('processes payment securely.', async () => {
  fetchMock.post('/api/payment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pay Now')); });

  expect(fetchMock.calls('/api/payment').length).toEqual(1);
  expect(screen.getByText('Payment processed securely')).toBeInTheDocument();
}, 10000);

test('displays error on secure payment failure.', async () => {
  fetchMock.post('/api/payment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pay Now')); });

  expect(fetchMock.calls('/api/payment').length).toEqual(1);
  expect(screen.getByText('Payment failed to process securely')).toBeInTheDocument();
}, 10000);