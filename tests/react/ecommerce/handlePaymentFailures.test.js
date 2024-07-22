import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Payment from './handlePaymentFailures';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('handle payment failure due to insufficient funds', async () => {
  fetchMock.post('/api/process-payment', { success: false, error: 'Insufficient funds' });

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
}, 10000);

test('handle payment failure with generic error', async () => {
  fetchMock.post('/api/process-payment', 500);

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);

