import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './linkProductToSupplier_purchaseReport_trackOrderShipmentStatus';

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

test('Generates purchase report successfully.', async () => {
  fetchMock.post('/api/purchase-report', { body: { status: 'success', data: { /* ...expected data... */ }} });

  await act(async () => { render(<MemoryRouter><PurchaseReport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-data')).toBeInTheDocument();
}, 10000);

test('Fails to generate purchase report due to server error.', async () => {
  fetchMock.post('/api/purchase-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><PurchaseReport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Validate tracking order shipment status updates order details correctly.', async () => {
  fetchMock.get('/api/shipment-status', { status: 200, body: { status: 'Shipped', trackingNumber: '123456789' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackShipmentStatus')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shipped')).toBeInTheDocument();
  expect(screen.getByText('123456789')).toBeInTheDocument();
}, 10000);

test('Tracking order shipment status doesn\'t update details due to error.', async () => {
  fetchMock.get('/api/shipment-status', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackShipmentStatus')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error tracking shipment status.')).toBeInTheDocument();
}, 10000);
