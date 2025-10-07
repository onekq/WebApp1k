import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteProductFromCatalog_reorderReport_rateSupplierPerformance_setReorderLevel';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Deleting a product removes it from the inventory list. (from deleteProductFromCatalog_reorderReport)', async () => {
  fetchMock.delete('/products/1', 204);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/delete/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.queryByText(/product 1 name/i)).not.toBeInTheDocument();
}, 10000);

test('Deleting a product shows an error message if the deletion fails. (from deleteProductFromCatalog_reorderReport)', async () => {
  fetchMock.delete('/products/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/delete/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/error deleting product/i)).toBeInTheDocument();
}, 10000);

test('Generates reorder report successfully. (from deleteProductFromCatalog_reorderReport)', async () => {
  fetchMock.post('/api/reorder-report', { body: { status: 'success', data: { /* ...expected data... */ }} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-data')).toBeInTheDocument();
}, 10000);

test('Fails to generate reorder report due to server error. (from deleteProductFromCatalog_reorderReport)', async () => {
  fetchMock.post('/api/reorder-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Successfully rates supplier performance. (from rateSupplierPerformance_setReorderLevel)', async () => {
  fetchMock.post('/api/suppliers/1/rate', { status: 200, body: { rating: 5 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('rate-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1/rate')).toBe(true);
  expect(screen.getByText('Rating: 5')).toBeInTheDocument();
}, 10000);

test('Fails to rate supplier performance. (from rateSupplierPerformance_setReorderLevel)', async () => {
  fetchMock.post('/api/suppliers/1/rate', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('rate-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1/rate')).toBe(true);
  expect(screen.getByText('Failed to rate supplier')).toBeInTheDocument();
}, 10000);

test('Triggers alert on setting reorder level successfully (from rateSupplierPerformance_setReorderLevel)', async () => {
  fetchMock.post('/api/reorder/level', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Reorder Level/i), { target: { value: 30 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Reorder Level/i)); });

  expect(fetchMock.calls('/api/reorder/level').length).toBe(1);
  expect(screen.getByText(/Reorder level set successfully/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when setting reorder level (from rateSupplierPerformance_setReorderLevel)', async () => {
  fetchMock.post('/api/reorder/level', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Reorder Level/i), { target: { value: 30 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Reorder Level/i)); });

  expect(fetchMock.calls('/api/reorder/level').length).toBe(1);
  expect(screen.getByText(/Error setting reorder level/i)).toBeInTheDocument();
}, 10000);

