import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './processBankTransferApp_sortReviewsByHelpfulness';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('process bank transfer payment successfully', async () => {
  fetchMock.post('/api/process-bank-transfer', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-bank-transfer-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process bank transfer payment', async () => {
  fetchMock.post('/api/process-bank-transfer', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-bank-transfer-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by helpfulness should display reviews in order', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=helpfulness', [{ id: 1, helpfulness: 10, content: 'Helpful review' }]);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="helpfulness" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=helpfulness')).toHaveLength(1);
  expect(screen.getByText('Helpful review')).toBeInTheDocument();
}, 10000);

test('Sorting reviews by helpfulness should display empty list when there are no reviews', async () => {
  fetchMock.get('/api/reviews?productId=123&sort=helpfulness', []);

  await act(async () => { render(<MemoryRouter><App productId="123" sort="helpfulness" /></MemoryRouter>); });

  expect(fetchMock.calls('/api/reviews?productId=123&sort=helpfulness')).toHaveLength(1);
  expect(screen.getByText('No reviews')).toBeInTheDocument();
}, 10000);