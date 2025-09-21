import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './auctionCountdown_productRatings_removeFromWishList';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('displays the auction countdown successfully.', async () => {
  const mockTimerData = { time: '10:00:00' };
  fetchMock.get('/api/auction-timer', { status: 200, body: mockTimerData });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('auction-timer-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10:00:00')).toBeInTheDocument();
}, 10000);

test('fails to display the auction countdown with an error message.', async () => {
  fetchMock.get('/api/auction-timer', { status: 400, body: { error: 'Failed to load timer' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('auction-timer-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load timer')).toBeInTheDocument();
}, 10000);

test('Product Ratings successfully displays product ratings.', async () => {
  fetchMock.get('/api/ratings', { status: 200, body: { ratings: ['Rating 1'] } });

  await act(async () => { render(<MemoryRouter><ProductRatings /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('ratings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rating 1')).toBeInTheDocument();
}, 10000);

test('Product Ratings fails and displays error message.', async () => {
  fetchMock.get('/api/ratings', { status: 500 });

  await act(async () => { render(<MemoryRouter><ProductRatings /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('ratings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch ratings')).toBeInTheDocument();
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
