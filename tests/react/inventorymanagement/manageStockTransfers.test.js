import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './manageStockTransfers';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Updates stock levels after stock transfer', async () => {
  fetchMock.post('/api/stock/transfer', { success: true, updatedStock: 70 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Transfer Stock/i)); });

  expect(fetchMock.calls('/api/stock/transfer').length).toBe(1);
  expect(screen.getByText(/Stock transferred. Updated Stock: 70/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when transferring stock', async () => {
  fetchMock.post('/api/stock/transfer', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Transfer Stock/i)); });

  expect(fetchMock.calls('/api/stock/transfer').length).toBe(1);
  expect(screen.getByText(/Error transferring stock/i)).toBeInTheDocument();
}, 10000);

