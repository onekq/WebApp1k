import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByCategory_flagInappropriateReviews';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Flagging inappropriate review should succeed', async () => {
  fetchMock.post('/api/reviews/flag/123', { status: 200 });

  await act(async () => { render(<MemoryRouter><App reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Flag as Inappropriate')); });

  expect(fetchMock.calls('/api/reviews/flag/123')).toHaveLength(1);
  expect(screen.getByText('Review flagged successfully')).toBeInTheDocument();
}, 10000);

test('Flagging inappropriate review should fail due to server error', async () => {
  fetchMock.post('/api/reviews/flag/123', { status: 500 });

  await act(async () => { render(<MemoryRouter><App reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Flag as Inappropriate')); });

  expect(fetchMock.calls('/api/reviews/flag/123')).toHaveLength(1);
  expect(screen.getByText('Failed to flag review')).toBeInTheDocument();
}, 10000);