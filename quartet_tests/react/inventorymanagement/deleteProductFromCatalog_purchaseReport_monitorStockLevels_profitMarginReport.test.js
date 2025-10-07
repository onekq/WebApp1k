import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteProductFromCatalog_purchaseReport_monitorStockLevels_profitMarginReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Deleting a product removes it from the inventory list. (from deleteProductFromCatalog_purchaseReport)', async () => {
  fetchMock.delete('/products/1', 204);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/delete/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.queryByText(/product 1 name/i)).not.toBeInTheDocument();
}, 10000);

test('Deleting a product shows an error message if the deletion fails. (from deleteProductFromCatalog_purchaseReport)', async () => {
  fetchMock.delete('/products/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/delete/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/error deleting product/i)).toBeInTheDocument();
}, 10000);

test('Generates purchase report successfully. (from deleteProductFromCatalog_purchaseReport)', async () => {
  fetchMock.post('/api/purchase-report', { body: { status: 'success', data: { /* ...expected data... */ }} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-data')).toBeInTheDocument();
}, 10000);

test('Fails to generate purchase report due to server error. (from deleteProductFromCatalog_purchaseReport)', async () => {
  fetchMock.post('/api/purchase-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Displays correct current stock on success (from monitorStockLevels_profitMarginReport)', async () => {
  fetchMock.get('/api/stock/levels', { stock: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls('/api/stock/levels').length).toBe(1);
  expect(screen.getByText(/Current Stock: 50/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when fetching stock levels (from monitorStockLevels_profitMarginReport)', async () => {
  fetchMock.get('/api/stock/levels', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls('/api/stock/levels').length).toBe(1);
  expect(screen.getByText(/Error fetching stock levels/i)).toBeInTheDocument();
}, 10000);

test('Generates profit margin report successfully. (from monitorStockLevels_profitMarginReport)', async () => {
  fetchMock.post('/api/profit-margin-report', { body: { status: 'success', data: { margin: 30 }}});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Profit Margin: 30%')).toBeInTheDocument();
}, 10000);

test('Fails to generate profit margin report due to server error. (from monitorStockLevels_profitMarginReport)', async () => {
  fetchMock.post('/api/profit-margin-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

