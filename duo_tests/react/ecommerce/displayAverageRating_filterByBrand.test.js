import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayAverageRating_filterByBrand';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displaying average product rating should show correct value', async () => {
  fetchMock.get('/api/reviews/average?productId=123', { averageRating: 4.5 });

  await act(async () => { render(<MemoryRouter><App productId="123" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews/average?productId=123')).toHaveLength(1);
  expect(screen.getByText('Average Rating: 4.5')).toBeInTheDocument();
}, 10000);

test('Displaying average product rating should fail to fetch data', async () => {
  fetchMock.get('/api/reviews/average?productId=123', { status: 500 });

  await act(async () => { render(<MemoryRouter><App productId="123" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews/average?productId=123')).toHaveLength(1);
  expect(screen.getByText('Failed to load average rating')).toBeInTheDocument();
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