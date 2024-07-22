import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Payment from './saveTransactionDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('save transaction details successfully', async () => {
  fetchMock.post('/api/save-transaction', { success: true });

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-transaction-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Transaction saved successfully')).toBeInTheDocument();
}, 10000);

test('fail to save transaction details', async () => {
  fetchMock.post('/api/save-transaction', 500);

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-transaction-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save transaction')).toBeInTheDocument();
}, 10000);

