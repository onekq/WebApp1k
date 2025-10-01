import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './orderConfirmation_salesReports_salesTaxCalculation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('displays order confirmation details correctly.', async () => {
  fetchMock.get('/api/order/confirmation', { body: { orderId: '12345' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Order Confirmation')); });

  expect(fetchMock.calls('/api/order/confirmation').length).toEqual(1);
  expect(screen.getByText('Order ID: 12345')).toBeInTheDocument();
}, 10000);

test('displays error on failing to fetch order confirmation.', async () => {
  fetchMock.get('/api/order/confirmation', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Order Confirmation')); });

  expect(fetchMock.calls('/api/order/confirmation').length).toEqual(1);
  expect(screen.getByText('Failed to fetch order confirmation')).toBeInTheDocument();
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

test('calculates sales tax based on location.', async () => {
  fetchMock.post('/api/salesTax', { body: { tax: 8 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tax-location-input'), { target: { value: 'NY' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Sales Tax')); });

  expect(fetchMock.calls('/api/salesTax').length).toEqual(1);
  expect(screen.getByText('Sales tax: 8%')).toBeInTheDocument();
}, 10000);

test('displays error on failing to calculate sales tax.', async () => {
  fetchMock.post('/api/salesTax', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tax-location-input'), { target: { value: 'CA' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Sales Tax')); });

  expect(fetchMock.calls('/api/salesTax').length).toEqual(1);
  expect(screen.getByText('Failed to calculate sales tax')).toBeInTheDocument();
}, 10000);
