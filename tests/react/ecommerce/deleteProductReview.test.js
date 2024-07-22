import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import DeleteReview from './deleteProductReview';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Deleting a product review should succeed', async () => {
  fetchMock.delete('/api/reviews/123', { status: 200 });

  await act(async () => { render(<MemoryRouter><DeleteReview reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls('/api/reviews/123')).toHaveLength(1);
  expect(screen.queryByText('Review deleted successfully')).toBeInTheDocument();
}, 10000);

test('Deleting a product review should fail due to server error', async () => {
  fetchMock.delete('/api/reviews/123', { status: 500 });

  await act(async () => { render(<MemoryRouter><DeleteReview reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls('/api/reviews/123')).toHaveLength(1);
  expect(screen.getByText('Failed to delete review')).toBeInTheDocument();
}, 10000);

