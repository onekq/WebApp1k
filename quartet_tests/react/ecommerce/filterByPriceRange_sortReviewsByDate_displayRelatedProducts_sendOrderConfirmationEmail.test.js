import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByPriceRange_sortReviewsByDate_displayRelatedProducts_sendOrderConfirmationEmail';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('filters by price range successfully (from filterByPriceRange_sortReviewsByDate)', async () => {
  fetchMock.get('/api/products?minPrice=100&maxPrice=500', { products: [{ id: 1, name: 'Laptop' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('min-price-filter'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('max-price-filter'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-price-filter')); });

  expect(fetchMock.called('/api/products?minPrice=100&maxPrice=500')).toBe(true);
  expect(screen.getByText('Laptop')).toBeInTheDocument();
}, 10000);

test('fails to filter by price range and shows error (from filterByPriceRange_sortReviewsByDate)', async () => {
  fetchMock.get('/api/products?minPrice=100&maxPrice=500', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('min-price-filter'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('max-price-filter'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-price-filter')); });

  expect(fetchMock.called('/api/products?minPrice=100&maxPrice=500')).toBe(true);
  expect(screen.getByText('Error loading products')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by newest date should display reviews in order (from filterByPriceRange_sortReviewsByDate)', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=newest', [{ id: 1, content: 'Recent review' }, { id: 2, content: 'Old review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="newest" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=newest')).toHaveLength(1);
  expect(screen.getByText('Recent review')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by oldest date should display reviews in order (from filterByPriceRange_sortReviewsByDate)', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=oldest', [{ id: 1, content: 'Old review' }, { id: 2, content: 'Recent review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="oldest" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=oldest')).toHaveLength(1);
  expect(screen.getByText('Old review')).toBeInTheDocument();
}, 10000);

test('displays related products successfully (from displayRelatedProducts_sendOrderConfirmationEmail)', async () => {
  fetchMock.get('/api/products/1/related', { products: [{ id: 2, name: 'Related Product' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1/related')).toBe(true);
  expect(screen.getByText('Related Product')).toBeInTheDocument();
}, 10000);

test('fails to display related products and shows error (from displayRelatedProducts_sendOrderConfirmationEmail)', async () => {
  fetchMock.get('/api/products/1/related', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1/related')).toBe(true);
  expect(screen.getByText('No related products found')).toBeInTheDocument();
}, 10000);

test('Sends order confirmation email successfully (from displayRelatedProducts_sendOrderConfirmationEmail)', async () => {
  fetchMock.post('/api/sendOrderConfirmationEmail', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Confirmation Email')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Order confirmation email sent successfully')).toBeInTheDocument();
}, 10000);

test('Fails to send order confirmation email (from displayRelatedProducts_sendOrderConfirmationEmail)', async () => {
  fetchMock.post('/api/sendOrderConfirmationEmail', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Confirmation Email')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to send order confirmation email')).toBeInTheDocument();
}, 10000);

