import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyDiscountCode_securePaymentProcessing_viewWishList';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('applies discount code successfully.', async () => {
  fetchMock.post('/api/discount', { body: { discount: 10 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code-input'), { target: { value: 'DISCOUNT10' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls('/api/discount').length).toEqual(1);
  expect(screen.getByText('Discount applied: 10%')).toBeInTheDocument();
}, 10000);

test('displays error on invalid discount code.', async () => {
  fetchMock.post('/api/discount', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code-input'), { target: { value: 'INVALIDCODE' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Discount')); });

  expect(fetchMock.calls('/api/discount').length).toEqual(1);
  expect(screen.getByText('Invalid discount code')).toBeInTheDocument();
}, 10000);

test('processes payment securely.', async () => {
  fetchMock.post('/api/payment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pay Now')); });

  expect(fetchMock.calls('/api/payment').length).toEqual(1);
  expect(screen.getByText('Payment processed securely')).toBeInTheDocument();
}, 10000);

test('displays error on secure payment failure.', async () => {
  fetchMock.post('/api/payment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pay Now')); });

  expect(fetchMock.calls('/api/payment').length).toEqual(1);
  expect(screen.getByText('Payment failed to process securely')).toBeInTheDocument();
}, 10000);

test('View Wish List success displays wish list items', async () => {
  fetchMock.get('/api/wishlist', [{ id: 1, product: 'Product 1' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/wishlist').length).toBe(1);
  expect(screen.getByText('Product 1')).toBeInTheDocument();
}, 10000);

test('View Wish List failure shows error message', async () => {
  fetchMock.get('/api/wishlist', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(screen.getByText('Error loading wish list')).toBeInTheDocument();
}, 10000);
