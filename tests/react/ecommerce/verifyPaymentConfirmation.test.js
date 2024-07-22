import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Payment from './verifyPaymentConfirmation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('verify payment confirmation successfully', async () => {
  fetchMock.get('/api/verify-payment-confirmation', { confirmed: true });

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('verify-payment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment confirmed')).toBeInTheDocument();
}, 10000);

test('fail to confirm payment', async () => {
  fetchMock.get('/api/verify-payment-confirmation', 500);

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('verify-payment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to confirm payment')).toBeInTheDocument();
}, 10000);