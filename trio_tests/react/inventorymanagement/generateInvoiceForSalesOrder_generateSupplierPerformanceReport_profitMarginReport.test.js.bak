import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './generateInvoiceForSalesOrder_generateSupplierPerformanceReport_profitMarginReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Verify generating an invoice for a sales order includes all relevant details.', async () => {
  fetchMock.get('/api/invoice', { status: 200, body: { invoice: { id: 1, total: 100, items: [{ item: 'Product A', quantity: 5 }] } } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generateInvoice')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product A')).toBeInTheDocument();
  expect(screen.getByText('100')).toBeInTheDocument();
}, 10000);

test('Generating an invoice for a sales order doesn\'t show details due to error.', async () => {
  fetchMock.get('/api/invoice', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generateInvoice')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error generating invoice.')).toBeInTheDocument();
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

test('Generates profit margin report successfully.', async () => {
  fetchMock.post('/api/profit-margin-report', { body: { status: 'success', data: { margin: 30 }}});

  await act(async () => { render(<MemoryRouter><ProfitMarginReport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Profit Margin: 30%')).toBeInTheDocument();
}, 10000);

test('Fails to generate profit margin report due to server error.', async () => {
  fetchMock.post('/api/profit-margin-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><ProfitMarginReport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);
