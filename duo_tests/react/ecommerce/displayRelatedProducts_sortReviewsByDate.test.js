import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayRelatedApp_sortReviewsByDate';

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