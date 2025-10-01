import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteProductReview_filterByCategory_saveOrderDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Deleting a product review should succeed', async () => {
  fetchMock.delete('/api/reviews/123', { status: 200 });

  await act(async () => { render(<MemoryRouter><App reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls('/api/reviews/123')).toHaveLength(1);
  expect(screen.queryByText('Review deleted successfully')).toBeInTheDocument();
}, 10000);

test('Deleting a product review should fail due to server error', async () => {
  fetchMock.delete('/api/reviews/123', { status: 500 });

  await act(async () => { render(<MemoryRouter><App reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete')); });

  expect(fetchMock.calls('/api/reviews/123')).toHaveLength(1);
  expect(screen.getByText('Failed to delete review')).toBeInTheDocument();
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

test('Saves order details successfully', async () => {
  fetchMock.post('/api/saveOrderDetails', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Order Details')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Order details saved successfully')).toBeInTheDocument();
}, 10000);

test('Fails to save order details', async () => {
  fetchMock.post('/api/saveOrderDetails', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Order Details')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to save order details')).toBeInTheDocument();
}, 10000);
