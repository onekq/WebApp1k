import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ApproveReview from '../approveOrDisapproveReviews';
import App from './approveOrDisapproveReviews_filterByCategory_updateProductReview';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Approving a review should succeed', async () => {
  fetchMock.post('/api/reviews/approve/123', { status: 200 });

  await act(async () => { render(<MemoryRouter><App reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Approve')); });

  expect(fetchMock.calls('/api/reviews/approve/123')).toHaveLength(1);
  expect(screen.getByText('Review approved')).toBeInTheDocument();
}, 10000);

test('Disapproving a review should fail due to server error', async () => {
  fetchMock.post('/api/reviews/disapprove/123', { status: 500 });

  await act(async () => { render(<MemoryRouter><App reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Disapprove')); });

  expect(fetchMock.calls('/api/reviews/disapprove/123')).toHaveLength(1);
  expect(screen.getByText('Failed to disapprove review')).toBeInTheDocument();
}, 10000);

test('filters by category successfully', async () => {
  fetchMock.get('/api/products?category=electronics', { products: [{ id: 1, name: 'TV' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('category-filter'), { target: { value: 'electronics' } }); });

  expect(fetchMock.called('/api/products?category=electronics')).toBe(true);
  expect(screen.getByText('TV')).toBeInTheDocument();
}, 10000);

test('fails to filter by category and shows error', async () => {
  fetchMock.get('/api/products?category=unknown', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('category-filter'), { target: { value: 'unknown' } }); });

  expect(fetchMock.called('/api/products?category=unknown')).toBe(true);
  expect(screen.getByText('No products found')).toBeInTheDocument();
}, 10000);

test('Updating a product review should succeed', async () => {
  fetchMock.put('/api/reviews/123', { status: 200 });

  await act(async () => { render(<MemoryRouter><App reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('review-input'), { target: { value: 'Updated review!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update')); });

  expect(fetchMock.calls('/api/reviews/123')).toHaveLength(1);
  expect(screen.getByText('Review updated successfully')).toBeInTheDocument();
}, 10000);

test('Updating a product review should fail due to server error', async () => {
  fetchMock.put('/api/reviews/123', { status: 500 });

  await act(async () => { render(<MemoryRouter><App reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('review-input'), { target: { value: 'Updated review!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update')); });

  expect(fetchMock.calls('/api/reviews/123')).toHaveLength(1);
  expect(screen.getByText('Failed to update review')).toBeInTheDocument();
}, 10000);
