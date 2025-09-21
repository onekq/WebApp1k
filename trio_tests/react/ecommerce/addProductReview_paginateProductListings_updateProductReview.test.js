import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addProductReview_paginateProductListings_updateProductReview';

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

test('paginates product listings successfully', async () => {
  fetchMock.get('/api/products?page=2', { products: [{ id: 2, name: 'Product 2' }] });

  await act(async () => { render(<MemoryRouter><Products /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('page-2')); });

  expect(fetchMock.called('/api/products?page=2')).toBe(true);
  expect(screen.getByText('Product 2')).toBeInTheDocument();
}, 10000);

test('fails to paginate product listings and shows error', async () => {
  fetchMock.get('/api/products?page=2', 500);

  await act(async () => { render(<MemoryRouter><Products /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('page-2')); });

  expect(fetchMock.called('/api/products?page=2')).toBe(true);
  expect(screen.getByText('Error loading products')).toBeInTheDocument();
}, 10000);

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
