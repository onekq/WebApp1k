import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyDiscountCode_flagInappropriateReviews_processPayPalPayment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('applyDiscountCode: successfully apply discount code to cart', async () => {
  fetchMock.post('/api/cart/discount', { status: 200, body: { message: 'Discount Applied' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code'), { target: { value: 'DISCOUNT2023' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-discount')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Discount Applied successfully')).toBeInTheDocument();  
}, 10000);

test('applyDiscountCode: fail to apply discount code to cart with error message', async () => {
  fetchMock.post('/api/cart/discount', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code'), { target: { value: 'DISCOUNT2023' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-discount')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to apply discount')).toBeInTheDocument();  
}, 10000);

test('Flagging inappropriate review should succeed', async () => {
  fetchMock.post('/api/reviews/flag/123', { status: 200 });

  await act(async () => { render(<MemoryRouter><App reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Flag as Inappropriate')); });

  expect(fetchMock.calls('/api/reviews/flag/123')).toHaveLength(1);
  expect(screen.getByText('Review flagged successfully')).toBeInTheDocument();
}, 10000);

test('Flagging inappropriate review should fail due to server error', async () => {
  fetchMock.post('/api/reviews/flag/123', { status: 500 });

  await act(async () => { render(<MemoryRouter><App reviewId="123" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Flag as Inappropriate')); });

  expect(fetchMock.calls('/api/reviews/flag/123')).toHaveLength(1);
  expect(screen.getByText('Failed to flag review')).toBeInTheDocument();
}, 10000);

test('process PayPal payment successfully', async () => {
  fetchMock.post('/api/process-paypal-payment', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-paypal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process PayPal payment', async () => {
  fetchMock.post('/api/process-paypal-payment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-paypal-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);
