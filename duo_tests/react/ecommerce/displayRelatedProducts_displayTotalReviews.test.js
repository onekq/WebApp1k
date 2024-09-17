import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayRelatedApp_displayTotalReviews';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Displaying total number of reviews should show correct count', async () => {
  fetchMock.get('/api/reviews/count?productId=123', { count: 100 });

  await act(async () => { render(<MemoryRouter><App productId="123" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews/count?productId=123')).toHaveLength(1);
  expect(screen.getByText('Total Reviews: 100')).toBeInTheDocument();
}, 10000);

test('Displaying total number of reviews should fail to fetch data', async () => {
  fetchMock.get('/api/reviews/count?productId=123', { status: 500 });

  await act(async () => { render(<MemoryRouter><App productId="123" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews/count?productId=123')).toHaveLength(1);
  expect(screen.getByText('Failed to load total reviews count')).toBeInTheDocument();
}, 10000);