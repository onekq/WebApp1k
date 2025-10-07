import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './processBankTransferPayment_sortReviewsByHelpfulness_applyLoyaltyPoints_handlePaymentFailures';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('process bank transfer payment successfully (from processBankTransferPayment_sortReviewsByHelpfulness)', async () => {
  fetchMock.post('/api/process-bank-transfer', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-bank-transfer-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process bank transfer payment (from processBankTransferPayment_sortReviewsByHelpfulness)', async () => {
  fetchMock.post('/api/process-bank-transfer', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-bank-transfer-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by helpfulness should display reviews in order (from processBankTransferPayment_sortReviewsByHelpfulness)', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=helpfulness', [{ id: 1, helpfulness: 10, content: 'Helpful review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="helpfulness" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=helpfulness')).toHaveLength(1);
  expect(screen.getByText('Helpful review')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by helpfulness should display empty list when there are no reviews (from processBankTransferPayment_sortReviewsByHelpfulness)', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=helpfulness', []);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="helpfulness" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=helpfulness')).toHaveLength(1);
  expect(screen.getByText('No reviews')).toBeInTheDocument();
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

