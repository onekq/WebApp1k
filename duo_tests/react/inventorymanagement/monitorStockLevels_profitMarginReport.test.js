import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './monitorStockLevels_profitMarginReport';

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

test('Generates profit margin report successfully.', async () => {
  fetchMock.post('/api/profit-margin-report', { body: { status: 'success', data: { margin: 30 }}});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Profit Margin: 30%')).toBeInTheDocument();
}, 10000);

test('Fails to generate profit margin report due to server error.', async () => {
  fetchMock.post('/api/profit-margin-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);