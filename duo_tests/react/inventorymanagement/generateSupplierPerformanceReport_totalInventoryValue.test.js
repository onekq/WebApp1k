import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './generateSupplierPerformanceReport_totalInventoryValue';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Calculates total inventory value successfully.', async () => {
  fetchMock.post('/api/total-inventory-value', { body: { status: 'success', data: { value: 10000 }}});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Inventory Value: $10,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total inventory value due to server error.', async () => {
  fetchMock.post('/api/total-inventory-value', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);