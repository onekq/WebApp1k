import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './productVariantManagement_salesReports_sellerRating';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Managing product variants succeeds.', async () => {
  fetchMock.post('/api/products/1/variants', { status: 200, body: { id: 1, size: 'M', color: 'Red' } });

  await act(async () => { render(<MemoryRouter><VariantManagement productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Size'), { target: { value: 'M' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Variant')); });

  expect(fetchMock.calls('/api/products/1/variants').length).toBe(1);
  expect(screen.getByText('Variant added successfully')).toBeInTheDocument();
}, 10000);

test('Managing product variants fails with error message.', async () => {
  fetchMock.post('/api/products/1/variants', { status: 400, body: { message: 'Invalid variant details' } });

  await act(async () => { render(<MemoryRouter><VariantManagement productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Size'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Variant')); });

  expect(fetchMock.calls('/api/products/1/variants').length).toBe(1);
  expect(screen.getByText('Invalid variant details')).toBeInTheDocument();
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

test('successfully rates a seller with a success message.', async () => {
  fetchMock.post('/api/rate-seller', { status: 200, body: { message: 'Seller rated successfully' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rating-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rate-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seller rated successfully')).toBeInTheDocument();
}, 10000);

test('fails to rate a seller with an error message.', async () => {
  fetchMock.post('/api/rate-seller', { status: 400, body: { error: 'Failed to rate seller' } });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rating-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rate-button')); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to rate seller')).toBeInTheDocument();
}, 10000);
