import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import UpdateReview from './updateProductReview';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Updating a product review should succeed', async () => {
  fetchMock.put('/api/reviews/123', { status: 200 });

  await act(async () => { render(<MemoryRouter><UpdateReview reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('review-input'), { target: { value: 'Updated review!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update')); });

  expect(fetchMock.calls('/api/reviews/123')).toHaveLength(1);
  expect(screen.getByText('Review updated successfully')).toBeInTheDocument();
}, 10000);

test('Updating a product review should fail due to server error', async () => {
  fetchMock.put('/api/reviews/123', { status: 500 });

  await act(async () => { render(<MemoryRouter><UpdateReview reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('review-input'), { target: { value: 'Updated review!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update')); });

  expect(fetchMock.calls('/api/reviews/123')).toHaveLength(1);
  expect(screen.getByText('Failed to update review')).toBeInTheDocument();
}, 10000);

