import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './productApp_salesReports';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Inventory management for sellers succeeds.', async () => {
  fetchMock.get('/api/seller/inventory', { status: 200, body: [{ id: 1, name: 'Sample Product', stock: 15 }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/seller/inventory').length).toBe(1);
  expect(screen.getByText('Sample Product')).toBeInTheDocument();
}, 10000);

test('Inventory management fails with error message.', async () => {
  fetchMock.get('/api/seller/inventory', { status: 500, body: { message: 'Internal server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/seller/inventory').length).toBe(1);
  expect(screen.getByText('Internal server error')).toBeInTheDocument();
}, 10000);

test('successfully generates sales reports.', async () => {
  const mockReportData = { report: 'Sales Report Data' };
  fetchMock.get('/api/sales-report', { status: 200, body: mockReportData });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sales Report Data')).toBeInTheDocument();
}, 10000);

test('fails to generate sales reports with an error message.', async () => {
  fetchMock.get('/api/sales-report', { status: 400, body: { error: 'Failed to generate report' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to generate report')).toBeInTheDocument();
}, 10000);