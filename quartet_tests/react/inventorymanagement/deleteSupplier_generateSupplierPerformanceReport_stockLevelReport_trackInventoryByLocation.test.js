import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteSupplier_generateSupplierPerformanceReport_stockLevelReport_trackInventoryByLocation';

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

test('Generates stock level report successfully. (from stockLevelReport_trackInventoryByLocation)', async () => {
  fetchMock.post('/api/stock-level-report', { body: { status: 'success', data: { /* ...expected data... */ }} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-data')).toBeInTheDocument();
}, 10000);

test('Fails to generate stock level report due to server error. (from stockLevelReport_trackInventoryByLocation)', async () => {
  fetchMock.post('/api/stock-level-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Shows accurate stock levels per location (from stockLevelReport_trackInventoryByLocation)', async () => {
  fetchMock.get('/api/inventory/location', { location1: 30, location2: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/inventory/location').length).toBe(1);
  expect(screen.getByText(/Location1: 30/i)).toBeInTheDocument();
  expect(screen.getByText(/Location2: 50/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when fetching inventory by location (from stockLevelReport_trackInventoryByLocation)', async () => {
  fetchMock.get('/api/inventory/location', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/inventory/location').length).toBe(1);
  expect(screen.getByText(/Error fetching inventory by location/i)).toBeInTheDocument();
}, 10000);

