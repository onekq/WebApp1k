import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ApproveReview from '../approveOrDisapproveReviews';
import DisapproveReview from './approveOrDisapproveReviews';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Approving a review should succeed', async () => {
  fetchMock.post('/api/reviews/approve/123', { status: 200 });

  await act(async () => { render(<MemoryRouter><ApproveReview reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Approve')); });

  expect(fetchMock.calls('/api/reviews/approve/123')).toHaveLength(1);
  expect(screen.getByText('Review approved')).toBeInTheDocument();
}, 10000);

test('Disapproving a review should fail due to server error', async () => {
  fetchMock.post('/api/reviews/disapprove/123', { status: 500 });

  await act(async () => { render(<MemoryRouter><DisapproveReview reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Disapprove')); });

  expect(fetchMock.calls('/api/reviews/disapprove/123')).toHaveLength(1);
  expect(screen.getByText('Failed to disapprove review')).toBeInTheDocument();
}, 10000);

