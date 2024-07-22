import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import FlagInappropriateReview from './flagInappropriateReviews';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Flagging inappropriate review should succeed', async () => {
  fetchMock.post('/api/reviews/flag/123', { status: 200 });

  await act(async () => { render(<MemoryRouter><FlagInappropriateReview reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Flag as Inappropriate')); });

  expect(fetchMock.calls('/api/reviews/flag/123')).toHaveLength(1);
  expect(screen.getByText('Review flagged successfully')).toBeInTheDocument();
}, 10000);

test('Flagging inappropriate review should fail due to server error', async () => {
  fetchMock.post('/api/reviews/flag/123', { status: 500 });

  await act(async () => { render(<MemoryRouter><FlagInappropriateReview reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Flag as Inappropriate')); });

  expect(fetchMock.calls('/api/reviews/flag/123')).toHaveLength(1);
  expect(screen.getByText('Failed to flag review')).toBeInTheDocument();
}, 10000);

