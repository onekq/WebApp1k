import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './analyzeInventoryTurnover_monitorStockExpirationDates_receiveAutomatedReorderAlerts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Analyzes inventory turnover successfully.', async () => {
  fetchMock.post('/api/inventory-turnover', { body: { status: 'success', data: { turnover: 10 }}});

  await act(async () => { render(<MemoryRouter><InventoryTurnover /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('analyze-turnover')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Inventory Turnover: 10')).toBeInTheDocument();
}, 10000);

test('Fails to analyze inventory turnover due to server error.', async () => {
  fetchMock.post('/api/inventory-turnover', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><InventoryTurnover /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('analyze-turnover')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

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

test('Sends automated reorder alert when stock falls below level', async () => {
  fetchMock.get('/api/stock/monitor', { stock: 10, reorderLevel: 20 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/stock/monitor').length).toBe(1);
  expect(screen.getByText(/Automated reorder alert sent/i)).toBeInTheDocument();
}, 10000);

test('Shows error on failure when sending automated reorder alerts', async () => {
  fetchMock.get('/api/stock/monitor', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/stock/monitor').length).toBe(1);
  expect(screen.getByText(/Error sending automated reorder alert/i)).toBeInTheDocument();
}, 10000);
