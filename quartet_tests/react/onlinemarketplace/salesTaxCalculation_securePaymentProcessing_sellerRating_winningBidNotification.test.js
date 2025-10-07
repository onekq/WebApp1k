import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './salesTaxCalculation_securePaymentProcessing_sellerRating_winningBidNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculates sales tax based on location. (from salesTaxCalculation_securePaymentProcessing)', async () => {
  fetchMock.post('/api/salesTax', { body: { tax: 8 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tax-location-input'), { target: { value: 'NY' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Sales Tax')); });

  expect(fetchMock.calls('/api/salesTax').length).toEqual(1);
  expect(screen.getByText('Sales tax: 8%')).toBeInTheDocument();
}, 10000);

test('displays error on failing to calculate sales tax. (from salesTaxCalculation_securePaymentProcessing)', async () => {
  fetchMock.post('/api/salesTax', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tax-location-input'), { target: { value: 'CA' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Sales Tax')); });

  expect(fetchMock.calls('/api/salesTax').length).toEqual(1);
  expect(screen.getByText('Failed to calculate sales tax')).toBeInTheDocument();
}, 10000);

test('processes payment securely. (from salesTaxCalculation_securePaymentProcessing)', async () => {
  fetchMock.post('/api/payment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pay Now')); });

  expect(fetchMock.calls('/api/payment').length).toEqual(1);
  expect(screen.getByText('Payment processed securely')).toBeInTheDocument();
}, 10000);

test('displays error on secure payment failure. (from salesTaxCalculation_securePaymentProcessing)', async () => {
  fetchMock.post('/api/payment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pay Now')); });

  expect(fetchMock.calls('/api/payment').length).toEqual(1);
  expect(screen.getByText('Payment failed to process securely')).toBeInTheDocument();
}, 10000);

test('successfully rates a seller with a success message. (from sellerRating_winningBidNotification)', async () => {
  fetchMock.post('/api/rate-seller', { status: 200, body: { message: 'Seller rated successfully' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rating-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rate-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seller rated successfully')).toBeInTheDocument();
}, 10000);

test('fails to rate a seller with an error message. (from sellerRating_winningBidNotification)', async () => {
  fetchMock.post('/api/rate-seller', { status: 400, body: { error: 'Failed to rate seller' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rating-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rate-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to rate seller')).toBeInTheDocument();
}, 10000);

test('successfully notifies user of winning bid. (from sellerRating_winningBidNotification)', async () => {
  fetchMock.get('/api/winning-bid', { status: 200, body: { message: 'You have won the bid!' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-winning-bid')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('You have won the bid!')).toBeInTheDocument();
}, 10000);

test('fails to notify user of winning bid with an error message. (from sellerRating_winningBidNotification)', async () => {
  fetchMock.get('/api/winning-bid', { status: 400, body: { error: 'No winning bid' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-winning-bid')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No winning bid')).toBeInTheDocument();
}, 10000);

