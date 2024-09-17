import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteSupplier_generateSupplierPerformanceReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully deletes a supplier.', async () => {
  fetchMock.delete('/api/suppliers/1', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('delete-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1')).toBe(true);
  expect(screen.queryByText('Test Supplier')).not.toBeInTheDocument();
}, 10000);

test('Fails to delete supplier with server error.', async () => {
  fetchMock.delete('/api/suppliers/1', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('delete-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1')).toBe(true);
  expect(screen.getByText('Failed to delete supplier')).toBeInTheDocument();
}, 10000);

test('Successfully generates supplier performance report.', async () => {
  fetchMock.get('/api/suppliers/1/report', { status: 200, body: { report: 'Performance Report Data' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.called('/api/suppliers/1/report')).toBe(true);
  expect(screen.getByText('Performance Report Data')).toBeInTheDocument();
}, 10000);

test('Fails to generate supplier performance report.', async () => {
  fetchMock.get('/api/suppliers/1/report', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.called('/api/suppliers/1/report')).toBe(true);
  expect(screen.getByText('Failed to generate report')).toBeInTheDocument();
}, 10000);