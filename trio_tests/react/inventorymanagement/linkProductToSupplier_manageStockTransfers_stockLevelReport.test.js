import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './linkProductToSupplier_manageStockTransfers_stockLevelReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully links a product to supplier.', async () => {
  fetchMock.post('/api/products/link', { status: 200, body: { productId: 1, supplierId: 1, linked: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('link-product-button')); });

  expect(fetchMock.called('/api/products/link')).toBe(true);
  expect(screen.getByText('Product linked to supplier successfully')).toBeInTheDocument();
}, 10000);

test('Fails to link product to supplier.', async () => {
  fetchMock.post('/api/products/link', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('link-product-button')); });

  expect(fetchMock.called('/api/products/link')).toBe(true);
  expect(screen.getByText('Failed to link product to supplier')).toBeInTheDocument();
}, 10000);

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

test('Generates stock level report successfully.', async () => {
  fetchMock.post('/api/stock-level-report', { body: { status: 'success', data: { /* ...expected data... */ }} });

  await act(async () => { render(<MemoryRouter><StockLevelReport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-data')).toBeInTheDocument();
}, 10000);

test('Fails to generate stock level report due to server error.', async () => {
  fetchMock.post('/api/stock-level-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><StockLevelReport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);
