import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './salesTaxCalculation_securePaymentProcessing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculates sales tax based on location.', async () => {
  fetchMock.post('/api/salesTax', { body: { tax: 8 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tax-location-input'), { target: { value: 'NY' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Sales Tax')); });

  expect(fetchMock.calls('/api/salesTax').length).toEqual(1);
  expect(screen.getByText('Sales tax: 8%')).toBeInTheDocument();
}, 10000);

test('displays error on failing to calculate sales tax.', async () => {
  fetchMock.post('/api/salesTax', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tax-location-input'), { target: { value: 'CA' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Sales Tax')); });

  expect(fetchMock.calls('/api/salesTax').length).toEqual(1);
  expect(screen.getByText('Failed to calculate sales tax')).toBeInTheDocument();
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