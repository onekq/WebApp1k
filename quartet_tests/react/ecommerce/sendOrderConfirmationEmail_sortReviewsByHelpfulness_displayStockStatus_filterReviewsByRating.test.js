import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sendOrderConfirmationEmail_sortReviewsByHelpfulness_displayStockStatus_filterReviewsByRating';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Sends order confirmation email successfully (from sendOrderConfirmationEmail_sortReviewsByHelpfulness)', async () => {
  fetchMock.post('/api/sendOrderConfirmationEmail', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Confirmation Email')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Order confirmation email sent successfully')).toBeInTheDocument();
}, 10000);

test('Fails to send order confirmation email (from sendOrderConfirmationEmail_sortReviewsByHelpfulness)', async () => {
  fetchMock.post('/api/sendOrderConfirmationEmail', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Confirmation Email')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to send order confirmation email')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by helpfulness should display reviews in order (from sendOrderConfirmationEmail_sortReviewsByHelpfulness)', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=helpfulness', [{ id: 1, helpfulness: 10, content: 'Helpful review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="helpfulness" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=helpfulness')).toHaveLength(1);
  expect(screen.getByText('Helpful review')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by helpfulness should display empty list when there are no reviews (from sendOrderConfirmationEmail_sortReviewsByHelpfulness)', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=helpfulness', []);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="helpfulness" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=helpfulness')).toHaveLength(1);
  expect(screen.getByText('No reviews')).toBeInTheDocument();
}, 10000);

test('displays product stock status successfully (from displayStockStatus_filterReviewsByRating)', async () => {
  fetchMock.get('/api/products/1', { id: 1, name: 'Product 1', stock: 'In Stock' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('In Stock')).toBeInTheDocument();
}, 10000);

test('fails to display product stock status and shows error (from displayStockStatus_filterReviewsByRating)', async () => {
  fetchMock.get('/api/products/1', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);

test('Filtering reviews by rating should display correct reviews (from displayStockStatus_filterReviewsByRating)', async () => {
  fetchMock.get('/api/reviews?rating=5', [{ id: 1, rating: 5, content: 'Great!' }]);

  await act(async () => { render(<MemoryRouter><App rating={5} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?rating=5')).toHaveLength(1);
  expect(screen.getByText('Great!')).toBeInTheDocument();
}, 10000);

test('Filtering reviews by rating should display no reviews for non-existent rating (from displayStockStatus_filterReviewsByRating)', async () => {
  fetchMock.get('/api/reviews?rating=5', []);

  await act(async () => { render(<MemoryRouter><App rating={5} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?rating=5')).toHaveLength(1);
  expect(screen.getByText('No reviews for this rating')).toBeInTheDocument();
}, 10000);

