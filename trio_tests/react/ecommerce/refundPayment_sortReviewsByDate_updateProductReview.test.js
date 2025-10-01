import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './refundPayment_sortReviewsByDate_updateProductReview';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('refund payment successfully', async () => {
  fetchMock.post('/api/refund-payment', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refund-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Refund processed successfully')).toBeInTheDocument();
}, 10000);

test('fail to refund payment', async () => {
  fetchMock.post('/api/refund-payment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refund-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Refund failed, please try again')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by newest date should display reviews in order', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=newest', [{ id: 1, content: 'Recent review' }, { id: 2, content: 'Old review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="newest" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=newest')).toHaveLength(1);
  expect(screen.getByText('Recent review')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by oldest date should display reviews in order', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=oldest', [{ id: 1, content: 'Old review' }, { id: 2, content: 'Recent review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="oldest" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=oldest')).toHaveLength(1);
  expect(screen.getByText('Old review')).toBeInTheDocument();
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
