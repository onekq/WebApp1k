import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteSupplier_generateSupplierPerformanceReport_addNewProductToCatalog_trackSupplierOrders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully deletes a supplier. (from deleteSupplier_generateSupplierPerformanceReport)', async () => {
  fetchMock.delete('/api/suppliers/1', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('delete-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1')).toBe(true);
  expect(screen.queryByText('Test Supplier')).not.toBeInTheDocument();
}, 10000);

test('Fails to delete supplier with server error. (from deleteSupplier_generateSupplierPerformanceReport)', async () => {
  fetchMock.delete('/api/suppliers/1', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('delete-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1')).toBe(true);
  expect(screen.getByText('Failed to delete supplier')).toBeInTheDocument();
}, 10000);

test('Successfully generates supplier performance report. (from deleteSupplier_generateSupplierPerformanceReport)', async () => {
  fetchMock.get('/api/suppliers/1/report', { status: 200, body: { report: 'Performance Report Data' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.called('/api/suppliers/1/report')).toBe(true);
  expect(screen.getByText('Performance Report Data')).toBeInTheDocument();
}, 10000);

test('Fails to generate supplier performance report. (from deleteSupplier_generateSupplierPerformanceReport)', async () => {
  fetchMock.get('/api/suppliers/1/report', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.called('/api/suppliers/1/report')).toBe(true);
  expect(screen.getByText('Failed to generate report')).toBeInTheDocument();
}, 10000);

test('Adding a new product to the catalog updates the inventory list correctly. (from addNewProductToCatalog_trackSupplierOrders)', async () => {
  fetchMock.post('/products', { id: 1, name: "New Product" });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'New Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/add product/i)); });

  expect(fetchMock.calls('/products')).toHaveLength(1);
  expect(screen.getByText(/new product/i)).toBeInTheDocument();
}, 10000);

test('Adding a new product to the catalog shows an error message if there is a failure. (from addNewProductToCatalog_trackSupplierOrders)', async () => {
  fetchMock.post('/products', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'New Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/add product/i)); });

  expect(fetchMock.calls('/products')).toHaveLength(1);
  expect(screen.getByText(/error adding product/i)).toBeInTheDocument();
}, 10000);

test('Successfully tracks supplier orders. (from addNewProductToCatalog_trackSupplierOrders)', async () => {
  fetchMock.get('/api/suppliers/1/orders', { status: 200, body: { orders: ['Order1', 'Order2'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('track-orders-button')); });

  expect(fetchMock.called('/api/suppliers/1/orders')).toBe(true);
  expect(screen.getByText('Order1')).toBeInTheDocument();
  expect(screen.getByText('Order2')).toBeInTheDocument();
}, 10000);

test('Fails to track supplier orders. (from addNewProductToCatalog_trackSupplierOrders)', async () => {
  fetchMock.get('/api/suppliers/1/orders', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('track-orders-button')); });

  expect(fetchMock.called('/api/suppliers/1/orders')).toBe(true);
  expect(screen.getByText('Failed to track orders')).toBeInTheDocument();
}, 10000);

