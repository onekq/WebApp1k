import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './paginateProductListings_processPayPalPayment_sortByPriceAsc_sortReviewsByDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('paginates product listings successfully (from paginateProductListings_processPayPalPayment)', async () => {
  fetchMock.get('/api/products?page=2', { products: [{ id: 2, name: 'Product 2' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('page-2')); });

  expect(fetchMock.called('/api/products?page=2')).toBe(true);
  expect(screen.getByText('Product 2')).toBeInTheDocument();
}, 10000);

test('fails to paginate product listings and shows error (from paginateProductListings_processPayPalPayment)', async () => {
  fetchMock.get('/api/products?page=2', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('page-2')); });

  expect(fetchMock.called('/api/products?page=2')).toBe(true);
  expect(screen.getByText('Error loading products')).toBeInTheDocument();
}, 10000);

test('process PayPal payment successfully (from paginateProductListings_processPayPalPayment)', async () => {
  fetchMock.post('/api/process-paypal-payment', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-paypal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process PayPal payment (from paginateProductListings_processPayPalPayment)', async () => {
  fetchMock.post('/api/process-paypal-payment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-paypal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);

test('sorts by price ascending successfully (from sortByPriceAsc_sortReviewsByDate)', async () => {
  fetchMock.get('/api/products?sort=price_asc', { products: [{ id: 1, name: 'Budget Phone' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-price-asc')); });

  expect(fetchMock.called('/api/products?sort=price_asc')).toBe(true);
  expect(screen.getByText('Budget Phone')).toBeInTheDocument();
}, 10000);

test('fails to sort by price ascending and shows error (from sortByPriceAsc_sortReviewsByDate)', async () => {
  fetchMock.get('/api/products?sort=price_asc', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-price-asc')); });

  expect(fetchMock.called('/api/products?sort=price_asc')).toBe(true);
  expect(screen.getByText('Error sorting products')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by newest date should display reviews in order (from sortByPriceAsc_sortReviewsByDate)', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=newest', [{ id: 1, content: 'Recent review' }, { id: 2, content: 'Old review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="newest" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=newest')).toHaveLength(1);
  expect(screen.getByText('Recent review')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by oldest date should display reviews in order (from sortByPriceAsc_sortReviewsByDate)', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=oldest', [{ id: 1, content: 'Old review' }, { id: 2, content: 'Recent review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="oldest" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=oldest')).toHaveLength(1);
  expect(screen.getByText('Old review')).toBeInTheDocument();
}, 10000);

