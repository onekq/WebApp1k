import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './productInventoryManagement_reservePriceMetNotification_viewProductReviews';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('successfully notifies user when reserve price is met.', async () => {
  fetchMock.get('/api/reserve-price', { status: 200, body: { message: 'Reserve price met' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-reserve-price')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reserve price met')).toBeInTheDocument();
}, 10000);

test('fails to notify user when reserve price is not met.', async () => {
  fetchMock.get('/api/reserve-price', { status: 400, body: { error: 'Reserve price not met' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-reserve-price')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reserve price not met')).toBeInTheDocument();
}, 10000);

test('View Product Reviews successfully displays reviews.', async () => {
  fetchMock.get('/api/reviews', { status: 200, body: { reviews: ['Review 1'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('reviews-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Review 1')).toBeInTheDocument();
}, 10000);

test('View Product Reviews fails and displays error message.', async () => {
  fetchMock.get('/api/reviews', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('reviews-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch reviews')).toBeInTheDocument();
}, 10000);
