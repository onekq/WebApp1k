import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayStockStatus_filterReviewsByRating_applyLoyaltyPoints_handlePaymentFailures';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Applies loyalty points successfully (from applyLoyaltyPoints_handlePaymentFailures)', async () => {
  fetchMock.post('/api/applyLoyaltyPoints', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Loyalty Points')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Loyalty points applied successfully')).toBeInTheDocument();
}, 10000);

test('Fails to apply loyalty points (from applyLoyaltyPoints_handlePaymentFailures)', async () => {
  fetchMock.post('/api/applyLoyaltyPoints', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Loyalty Points')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to apply loyalty points')).toBeInTheDocument();
}, 10000);

test('handle payment failure due to insufficient funds (from applyLoyaltyPoints_handlePaymentFailures)', async () => {
  fetchMock.post('/api/process-payment', { success: false, error: 'Insufficient funds' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
}, 10000);

test('handle payment failure with generic error (from applyLoyaltyPoints_handlePaymentFailures)', async () => {
  fetchMock.post('/api/process-payment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);

