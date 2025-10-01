import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyDiscountCode_productRatings_securePaymentProcessing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('applies discount code successfully.', async () => {
  fetchMock.post('/api/discount', { body: { discount: 10 } });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code-input'), { target: { value: 'DISCOUNT10' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls('/api/discount').length).toEqual(1);
  expect(screen.getByText('Discount applied: 10%')).toBeInTheDocument();
}, 10000);

test('displays error on invalid discount code.', async () => {
  fetchMock.post('/api/discount', 400);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code-input'), { target: { value: 'INVALIDCODE' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls('/api/discount').length).toEqual(1);
  expect(screen.getByText('Invalid discount code')).toBeInTheDocument();
}, 10000);

test('Product Ratings successfully displays product ratings.', async () => {
  fetchMock.get('/api/ratings', { status: 200, body: { ratings: ['Rating 1'] } });

  await act(async () => { render(<MemoryRouter><ProductRatings /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('ratings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rating 1')).toBeInTheDocument();
}, 10000);

test('Product Ratings fails and displays error message.', async () => {
  fetchMock.get('/api/ratings', { status: 500 });

  await act(async () => { render(<MemoryRouter><ProductRatings /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('ratings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch ratings')).toBeInTheDocument();
}, 10000);

test('processes payment securely.', async () => {
  fetchMock.post('/api/payment', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pay Now')); });

  expect(fetchMock.calls('/api/payment').length).toEqual(1);
  expect(screen.getByText('Payment processed securely')).toBeInTheDocument();
}, 10000);

test('displays error on secure payment failure.', async () => {
  fetchMock.post('/api/payment', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pay Now')); });

  expect(fetchMock.calls('/api/payment').length).toEqual(1);
  expect(screen.getByText('Payment failed to process securely')).toBeInTheDocument();
}, 10000);
