import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Payment from './refundPayment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('refund payment successfully', async () => {
  fetchMock.post('/api/refund-payment', { success: true });

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refund-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Refund processed successfully')).toBeInTheDocument();
}, 10000);

test('fail to refund payment', async () => {
  fetchMock.post('/api/refund-payment', 500);

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refund-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Refund failed, please try again')).toBeInTheDocument();
}, 10000);

