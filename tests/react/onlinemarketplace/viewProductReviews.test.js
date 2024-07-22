import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ViewProductReviews from './viewProductReviews';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('View Product Reviews successfully displays reviews.', async () => {
  fetchMock.get('/api/reviews', { status: 200, body: { reviews: ['Review 1'] } });

  await act(async () => { render(<MemoryRouter><ViewProductReviews /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('reviews-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Review 1')).toBeInTheDocument();
}, 10000);

test('View Product Reviews fails and displays error message.', async () => {
  fetchMock.get('/api/reviews', { status: 500 });

  await act(async () => { render(<MemoryRouter><ViewProductReviews /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('reviews-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch reviews')).toBeInTheDocument();
}, 10000);

