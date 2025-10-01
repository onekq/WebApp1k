import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './productAvailabilityNotification_refundProcessing_wishListManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Product availability notification succeeds.', async () => {
  fetchMock.post('/api/notify', { status: 200, body: { message: 'Notification set successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Notification set successfully')).toBeInTheDocument();
}, 10000);

test('Product availability notification fails with error message.', async () => {
  fetchMock.post('/api/notify', { status: 400, body: { message: 'Invalid email address' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Notify Me')); });

  expect(fetchMock.calls('/api/notify').length).toBe(1);
  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
}, 10000);

test('processes refund successfully.', async () => {
  fetchMock.post('/api/refund', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Request Refund')); });

  expect(fetchMock.calls('/api/refund').length).toEqual(1);
  expect(screen.getByText('Refund processed successfully')).toBeInTheDocument();
}, 10000);

test('displays error on refund processing failure.', async () => {
  fetchMock.post('/api/refund', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Request Refund')); });

  expect(fetchMock.calls('/api/refund').length).toEqual(1);
  expect(screen.getByText('Refund processing failed')).toBeInTheDocument();
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
