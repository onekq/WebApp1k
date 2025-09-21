import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateCartSubtotal_calculateShippingCost_sortReviewsByHelpfulness';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('calculateCartSubtotal: successfully calculate cart subtotal', async () => {
  fetchMock.get('/api/cart/subtotal', { status: 200, body: { subtotal: '100.00' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-subtotal')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Subtotal: $100.00')).toBeInTheDocument();  
}, 10000);

test('calculateCartSubtotal: fail to calculate cart subtotal with error message', async () => {
  fetchMock.get('/api/cart/subtotal', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-subtotal')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate subtotal')).toBeInTheDocument();  
}, 10000);

test('calculateShippingCost: successfully calculate shipping costs', async () => {
  fetchMock.get('/api/cart/shipping', { status: 200, body: { shipping: '15.00' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Shipping: $15.00')).toBeInTheDocument();  
}, 10000);

test('calculateShippingCost: fail to calculate shipping costs with error message', async () => {
  fetchMock.get('/api/cart/shipping', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate shipping')).toBeInTheDocument();  
}, 10000);

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
