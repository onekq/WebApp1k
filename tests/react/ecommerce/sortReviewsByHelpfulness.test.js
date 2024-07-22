import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SortReviews from './sortReviewsByHelpfulness';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Sorting reviews by helpfulness should display reviews in order', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=helpfulness', [{ id: 1, helpfulness: 10, content: 'Helpful review' }]);

  await act(async () => { render(<MemoryRouter><SortReviews productId="123" sort="helpfulness" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=helpfulness')).toHaveLength(1);
  expect(screen.getByText('Helpful review')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by helpfulness should display empty list when there are no reviews', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=helpfulness', []);

  await act(async () => { render(<MemoryRouter><SortReviews productId="123" sort="helpfulness" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=helpfulness')).toHaveLength(1);
  expect(screen.getByText('No reviews')).toBeInTheDocument();
}, 10000);