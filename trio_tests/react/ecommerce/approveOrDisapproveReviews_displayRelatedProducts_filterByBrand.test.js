import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ApproveReview from '../approveOrDisapproveReviews';
import App from './approveOrDisapproveReviews_displayRelatedProducts_filterByBrand';

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

test('displays related products successfully', async () => {
  fetchMock.get('/api/products/1/related', { products: [{ id: 2, name: 'Related Product' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1/related')).toBe(true);
  expect(screen.getByText('Related Product')).toBeInTheDocument();
}, 10000);

test('fails to display related products and shows error', async () => {
  fetchMock.get('/api/products/1/related', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1/related')).toBe(true);
  expect(screen.getByText('No related products found')).toBeInTheDocument();
}, 10000);

test('filters by brand successfully', async () => {
  fetchMock.get('/api/products?brand=sony', { products: [{ id: 1, name: 'PlayStation' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('brand-filter'), { target: { value: 'sony' } }); });

  expect(fetchMock.called('/api/products?brand=sony')).toBe(true);
  expect(screen.getByText('PlayStation')).toBeInTheDocument();
}, 10000);

test('fails to filter by brand and shows error', async () => {
  fetchMock.get('/api/products?brand=unknown', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('brand-filter'), { target: { value: 'unknown' } }); });

  expect(fetchMock.called('/api/products?brand=unknown')).toBe(true);
  expect(screen.getByText('No products found')).toBeInTheDocument();
}, 10000);
