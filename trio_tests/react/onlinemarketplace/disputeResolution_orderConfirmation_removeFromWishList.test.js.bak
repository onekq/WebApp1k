import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './disputeResolution_orderConfirmation_removeFromWishList';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Dispute Resolution success resolves the dispute', async () => {
  fetchMock.post('/api/orders/1/dispute', { status: 'Resolved' });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Resolve Dispute')); });

  expect(fetchMock.calls('/api/orders/1/dispute').length).toBe(1);
  expect(screen.getByText('Dispute resolved')).toBeInTheDocument();
}, 10000);

test('Dispute Resolution failure shows error message', async () => {
  fetchMock.post('/api/orders/1/dispute', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Resolve Dispute')); });

  expect(screen.getByText('Error resolving dispute')).toBeInTheDocument();
}, 10000);

test('displays order confirmation details correctly.', async () => {
  fetchMock.get('/api/order/confirmation', { body: { orderId: '12345' } });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Order Confirmation')); });

  expect(fetchMock.calls('/api/order/confirmation').length).toEqual(1);
  expect(screen.getByText('Order ID: 12345')).toBeInTheDocument();
}, 10000);

test('displays error on failing to fetch order confirmation.', async () => {
  fetchMock.get('/api/order/confirmation', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Order Confirmation')); });

  expect(fetchMock.calls('/api/order/confirmation').length).toEqual(1);
  expect(screen.getByText('Failed to fetch order confirmation')).toBeInTheDocument();
}, 10000);

test('Remove from Wish List success removes item from wish list', async () => {
  fetchMock.delete('/api/wishlist/1', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Wish List')); });

  expect(fetchMock.calls('/api/wishlist/1').length).toBe(1);
  expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
}, 10000);

test('Remove from Wish List failure shows error message', async () => {
  fetchMock.delete('/api/wishlist/1', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Wish List')); });

  expect(screen.getByText('Error removing from wish list')).toBeInTheDocument();
}, 10000);
