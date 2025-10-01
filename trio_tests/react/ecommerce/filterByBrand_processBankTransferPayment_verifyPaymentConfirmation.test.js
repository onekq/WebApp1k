import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByBrand_processBankTransferPayment_verifyPaymentConfirmation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('filters by brand successfully', async () => {
  fetchMock.get('/api/products?brand=sony', { products: [{ id: 1, name: 'PlayStation' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('brand-filter'), { target: { value: 'sony' } }); });

  expect(fetchMock.called('/api/products?brand=sony')).toBe(true);
  expect(screen.getByText('PlayStation')).toBeInTheDocument();
}, 10000);

test('fails to filter by brand and shows error', async () => {
  fetchMock.get('/api/products?brand=unknown', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('brand-filter'), { target: { value: 'unknown' } }); });

  expect(fetchMock.called('/api/products?brand=unknown')).toBe(true);
  expect(screen.getByText('No products found')).toBeInTheDocument();
}, 10000);

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

test('verify payment confirmation successfully', async () => {
  fetchMock.get('/api/verify-payment-confirmation', { confirmed: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('verify-payment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment confirmed')).toBeInTheDocument();
}, 10000);

test('fail to confirm payment', async () => {
  fetchMock.get('/api/verify-payment-confirmation', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('verify-payment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to confirm payment')).toBeInTheDocument();
}, 10000);
