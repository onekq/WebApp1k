import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addToCart_flagInappropriateReviews_searchByKeyword';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('addToCart: successfully add a product to the cart', async () => {
  fetchMock.post('/api/cart', { status: 200, body: { message: 'Added' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Added successfully')).toBeInTheDocument();  
}, 10000);

test('addToCart: fail to add a product to the cart with error message', async () => {
  fetchMock.post('/api/cart', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to add item to cart')).toBeInTheDocument();  
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

test('searches by keyword successfully', async () => {
  fetchMock.get('/api/products?search=phone', { products: [{ id: 1, name: 'Smartphone' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('keyword-search'), { target: { value: 'phone' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.called('/api/products?search=phone')).toBe(true);
  expect(screen.getByText('Smartphone')).toBeInTheDocument();
}, 10000);

test('fails to search by keyword and shows error', async () => {
  fetchMock.get('/api/products?search=unknown', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('keyword-search'), { target: { value: 'unknown' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.called('/api/products?search=unknown')).toBe(true);
  expect(screen.getByText('No products found')).toBeInTheDocument();
}, 10000);
