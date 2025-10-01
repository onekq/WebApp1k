import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayTotalReviews_filterByCategory_generateOrderConfirmationNumber';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('Generates order confirmation number successfully', async () => {
  fetchMock.get('/api/generateOrderConfirmationNumber', { confirmationNumber: '123456' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Confirmation Number')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Order confirmation number: 123456')).toBeInTheDocument();
}, 10000);

test('Fails to generate order confirmation number', async () => {
  fetchMock.get('/api/generateOrderConfirmationNumber', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Confirmation Number')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to generate order confirmation number')).toBeInTheDocument();
}, 10000);
