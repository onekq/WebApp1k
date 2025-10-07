import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './rateProduct_selectPaymentMethod_sellerRating_winningBidNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Rate Product successfully submits a rating. (from rateProduct_selectPaymentMethod)', async () => {
  fetchMock.post('/api/rate', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('star-4')); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-rating-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rating submitted')).toBeInTheDocument();
}, 10000);

test('Rate Product fails and displays error message. (from rateProduct_selectPaymentMethod)', async () => {
  fetchMock.post('/api/rate', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('star-4')); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-rating-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to submit rating')).toBeInTheDocument();
}, 10000);

test('validates selecting a payment method successfully. (from rateProduct_selectPaymentMethod)', async () => {
  fetchMock.post('/api/payment-method', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Select Payment Method')); });
  await act(async () => { fireEvent.click(screen.getByText('Credit Card')); });

  expect(fetchMock.calls('/api/payment-method').length).toEqual(1);
  expect(screen.getByText('Credit Card selected')).toBeInTheDocument();
}, 10000);

test('displays error on invalid payment method selection. (from rateProduct_selectPaymentMethod)', async () => {
  fetchMock.post('/api/payment-method', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Select Payment Method')); });
  await act(async () => { fireEvent.click(screen.getByText('Expired Card')); });

  expect(fetchMock.calls('/api/payment-method').length).toEqual(1);
  expect(screen.getByText('Invalid payment method selected')).toBeInTheDocument();
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

