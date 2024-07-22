import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './monitorStockExpirationDates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Lists products nearing expiration', async () => {
  fetchMock.get('/api/stock/expiration', { products: [{ name: "Product A", expiresIn: 5 }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/stock/expiration').length).toBe(1);
  expect(screen.getByText(/Product A - Expires in 5 days/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when fetching expiration dates', async () => {
  fetchMock.get('/api/stock/expiration', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/stock/expiration').length).toBe(1);
  expect(screen.getByText(/Error fetching expiration dates/i)).toBeInTheDocument();
}, 10000);

