import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addToCart_rateProduct_userNotifications';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Adding a product to the cart succeeds.', async () => {
  fetchMock.post('/api/cart', { status: 200, body: { message: 'Added to cart successfully' } });

  await act(async () => { render(<MemoryRouter><ProductPage productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add to Cart')); });

  expect(fetchMock.calls('/api/cart').length).toBe(1);
  expect(screen.getByText('Added to cart successfully')).toBeInTheDocument();
}, 10000);

test('Adding a product to the cart fails with error message.', async () => {
  fetchMock.post('/api/cart', { status: 400, body: { message: 'Product out of stock' } });

  await act(async () => { render(<MemoryRouter><ProductPage productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add to Cart')); });

  expect(fetchMock.calls('/api/cart').length).toBe(1);
  expect(screen.getByText('Product out of stock')).toBeInTheDocument();
}, 10000);

test('Rate Product successfully submits a rating.', async () => {
  fetchMock.post('/api/rate', { status: 200 });

  await act(async () => { render(<MemoryRouter><RateProduct /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('star-4')); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-rating-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rating submitted')).toBeInTheDocument();
}, 10000);

test('Rate Product fails and displays error message.', async () => {
  fetchMock.post('/api/rate', { status: 500 });

  await act(async () => { render(<MemoryRouter><RateProduct /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('star-4')); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-rating-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to submit rating')).toBeInTheDocument();
}, 10000);

test('User Notifications successfully displays notifications.', async () => {
  fetchMock.get('/api/notifications', { status: 200, body: { notifications: ['Notification 1'] } });

  await act(async () => { render(<MemoryRouter><UserNotifications /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification 1')).toBeInTheDocument();
}, 10000);

test('User Notifications fails and displays error message.', async () => {
  fetchMock.get('/api/notifications', { status: 500 });

  await act(async () => { render(<MemoryRouter><UserNotifications /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch notifications')).toBeInTheDocument();
}, 10000);
