import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removeFromCart_viewSellerRatings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Removing a product from the cart succeeds.', async () => {
  fetchMock.delete('/api/cart/1', { status: 200, body: { message: 'Removed from cart successfully' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Cart')); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Removed from cart successfully')).toBeInTheDocument();
}, 10000);

test('Removing a product from the cart fails with error message.', async () => {
  fetchMock.delete('/api/cart/1', { status: 400, body: { message: 'Failed to remove from cart' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Cart')); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Failed to remove from cart')).toBeInTheDocument();
}, 10000);

test('successfully views seller ratings.', async () => {
  const mockRatings = [
    { id: 1, rating: 5, comment: 'Excellent seller!' },
    { id: 2, rating: 4, comment: 'Very good service.' }
  ];
  fetchMock.get('/api/seller-ratings', { status: 200, body: mockRatings });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-ratings-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Excellent seller!')).toBeInTheDocument();
  expect(screen.getByText('Very good service.')).toBeInTheDocument();
}, 10000);

test('fails to view seller ratings with an error message.', async () => {
  fetchMock.get('/api/seller-ratings', { status: 400, body: { error: 'Failed to load ratings' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-ratings-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load ratings')).toBeInTheDocument();
}, 10000);