import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateTaxes_sortByRatingHigh_applyLoyaltyPoints_handlePaymentFailures';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculateTaxes: successfully calculate taxes (from calculateTaxes_sortByRatingHigh)', async () => {
  fetchMock.get('/api/cart/taxes', { status: 200, body: { taxes: '8.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-taxes')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Taxes: $8.00')).toBeInTheDocument();  
}, 10000);

test('calculateTaxes: fail to calculate taxes with error message (from calculateTaxes_sortByRatingHigh)', async () => {
  fetchMock.get('/api/cart/taxes', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-taxes')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate taxes')).toBeInTheDocument();  
}, 10000);

test('sorts by highest rating successfully (from calculateTaxes_sortByRatingHigh)', async () => {
  fetchMock.get('/api/products?sort=rating_desc', { products: [{ id: 1, name: 'Top Rated Phone' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-rating-high')); });

  expect(fetchMock.called('/api/products?sort=rating_desc')).toBe(true);
  expect(screen.getByText('Top Rated Phone')).toBeInTheDocument();
}, 10000);

test('fails to sort by highest rating and shows error (from calculateTaxes_sortByRatingHigh)', async () => {
  fetchMock.get('/api/products?sort=rating_desc', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-rating-high')); });

  expect(fetchMock.called('/api/products?sort=rating_desc')).toBe(true);
  expect(screen.getByText('Error sorting products')).toBeInTheDocument();
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

