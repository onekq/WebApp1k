import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import AddReview from './addProductReview';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Adding a product review should succeed', async () => {
  fetchMock.post('/api/reviews', { status: 201 });

  await act(async () => { render(<MemoryRouter><AddReview /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('review-input'), { target: { value: 'Great product!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });

  expect(fetchMock.calls('/api/reviews')).toHaveLength(1);
  expect(screen.getByText('Review added successfully')).toBeInTheDocument();
}, 10000);

test('Adding a product review should fail due to server error', async () => {
  fetchMock.post('/api/reviews', { status: 500 });

  await act(async () => { render(<MemoryRouter><AddReview /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('review-input'), { target: { value: 'Great product!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });

  expect(fetchMock.calls('/api/reviews')).toHaveLength(1);
  expect(screen.getByText('Failed to add review')).toBeInTheDocument();
}, 10000);

