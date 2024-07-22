import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Products from './SortByRatingHigh';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('sorts by highest rating successfully', async () => {
  fetchMock.get('/api/products?sort=rating_desc', { products: [{ id: 1, name: 'Top Rated Phone' }] });

  await act(async () => { render(<MemoryRouter><Products /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-rating-high')); });

  expect(fetchMock.called('/api/products?sort=rating_desc')).toBe(true);
  expect(screen.getByText('Top Rated Phone')).toBeInTheDocument();
}, 10000);

test('fails to sort by highest rating and shows error', async () => {
  fetchMock.get('/api/products?sort=rating_desc', 500);

  await act(async () => { render(<MemoryRouter><Products /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-rating-high')); });

  expect(fetchMock.called('/api/products?sort=rating_desc')).toBe(true);
  expect(screen.getByText('Error sorting products')).toBeInTheDocument();
}, 10000);

