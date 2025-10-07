import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './handleReturns_trackOrderShipmentStatus_addNewSupplier_analyzeInventoryTurnover';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Ensure handling returns updates inventory levels and order status correctly. (from handleReturns_trackOrderShipmentStatus)', async () => {
  fetchMock.post('/api/returns', { status: 200, body: { success: true, newStockLevel: 105 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('returnInput'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitReturn')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('newStockLevel')).toHaveTextContent('105');
}, 10000);

test('Validate tracking order shipment status updates order details correctly. (from handleReturns_trackOrderShipmentStatus)', async () => {
  fetchMock.get('/api/shipment-status', { status: 200, body: { status: 'Shipped', trackingNumber: '123456789' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('trackShipmentStatus')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shipped')).toBeInTheDocument();
  expect(screen.getByText('123456789')).toBeInTheDocument();
}, 10000);

test('Successfully adds a new supplier. (from addNewSupplier_analyzeInventoryTurnover)', async () => {
  fetchMock.post('/api/suppliers', { status: 201, body: { id: 1, name: 'New Supplier' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.change(screen.getByTestId('supplier-name'), { target: { value: 'New Supplier' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-supplier-button')); });

  expect(fetchMock.called('/api/suppliers')).toBe(true);
  expect(screen.getByText('New Supplier')).toBeInTheDocument();
}, 10000);

test('Fails to add a new supplier with server error. (from addNewSupplier_analyzeInventoryTurnover)', async () => {
  fetchMock.post('/api/suppliers', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.change(screen.getByTestId('supplier-name'), { target: { value: 'New Supplier' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-supplier-button')); });

  expect(fetchMock.called('/api/suppliers')).toBe(true);
  expect(screen.getByText('Failed to add supplier')).toBeInTheDocument();
}, 10000);

test('Analyzes inventory turnover successfully. (from addNewSupplier_analyzeInventoryTurnover)', async () => {
  fetchMock.post('/api/inventory-turnover', { body: { status: 'success', data: { turnover: 10 }}});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('analyze-turnover')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Inventory Turnover: 10')).toBeInTheDocument();
}, 10000);

test('Fails to analyze inventory turnover due to server error. (from addNewSupplier_analyzeInventoryTurnover)', async () => {
  fetchMock.post('/api/inventory-turnover', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('analyze-turnover')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

