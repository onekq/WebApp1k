import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './analyzeInventoryTurnover_manageOrderCancellations_trackDamagedStock';

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

test('Ensure managing order cancellations updates stock levels and order status correctly.', async () => {
  fetchMock.post('/api/cancel-order', { status: 200, body: { success: true, newStockLevel: 95 } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('cancelOrder')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('newStockLevel')).toHaveTextContent('95');
}, 10000);

test('Managing order cancellations doesn\'t update stock levels due to error.', async () => {
  fetchMock.post('/api/cancel-order', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('cancelOrder')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error cancelling order.')).toBeInTheDocument();
}, 10000);

test('Updates inventory and status correctly for damaged stock', async () => {
  fetchMock.post('/api/stock/damaged', { success: true, updatedStock: 60 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report Damaged Stock/i)); });

  expect(fetchMock.calls('/api/stock/damaged').length).toBe(1);
  expect(screen.getByText(/Damaged stock reported. Updated Stock: 60/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when reporting damaged stock', async () => {
  fetchMock.post('/api/stock/damaged', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report Damaged Stock/i)); });

  expect(fetchMock.calls('/api/stock/damaged').length).toBe(1);
  expect(screen.getByText(/Error reporting damaged stock/i)).toBeInTheDocument();
}, 10000);
