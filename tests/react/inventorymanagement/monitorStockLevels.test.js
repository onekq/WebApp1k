import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './monitorStockLevels';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays correct current stock on success', async () => {
  fetchMock.get('/api/stock/levels', { stock: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls('/api/stock/levels').length).toBe(1);
  expect(screen.getByText(/Current Stock: 50/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when fetching stock levels', async () => {
  fetchMock.get('/api/stock/levels', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls('/api/stock/levels').length).toBe(1);
  expect(screen.getByText(/Error fetching stock levels/i)).toBeInTheDocument();
}, 10000);

