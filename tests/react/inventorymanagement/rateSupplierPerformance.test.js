import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './rateSupplierPerformance';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully rates supplier performance.', async () => {
  fetchMock.post('/api/suppliers/1/rate', { status: 200, body: { rating: 5 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('rate-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1/rate')).toBe(true);
  expect(screen.getByText('Rating: 5')).toBeInTheDocument();
}, 10000);

test('Fails to rate supplier performance.', async () => {
  fetchMock.post('/api/suppliers/1/rate', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('rate-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1/rate')).toBe(true);
  expect(screen.getByText('Failed to rate supplier')).toBeInTheDocument();
}, 10000);

