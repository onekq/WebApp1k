import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './totalPurchaseValue_trackSupplierOrders_addNewSupplier_viewProductDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Calculates total purchase value successfully. (from totalPurchaseValue_trackSupplierOrders)', async () => {
  fetchMock.post('/api/total-purchase-value', { body: { status: 'success', data: { value: 15000 }}});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Purchase Value: $15,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total purchase value due to server error. (from totalPurchaseValue_trackSupplierOrders)', async () => {
  fetchMock.post('/api/total-purchase-value', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Successfully tracks supplier orders. (from totalPurchaseValue_trackSupplierOrders)', async () => {
  fetchMock.get('/api/suppliers/1/orders', { status: 200, body: { orders: ['Order1', 'Order2'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('track-orders-button')); });

  expect(fetchMock.called('/api/suppliers/1/orders')).toBe(true);
  expect(screen.getByText('Order1')).toBeInTheDocument();
  expect(screen.getByText('Order2')).toBeInTheDocument();
}, 10000);

test('Fails to track supplier orders. (from totalPurchaseValue_trackSupplierOrders)', async () => {
  fetchMock.get('/api/suppliers/1/orders', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('track-orders-button')); });

  expect(fetchMock.called('/api/suppliers/1/orders')).toBe(true);
  expect(screen.getByText('Failed to track orders')).toBeInTheDocument();
}, 10000);

test('Successfully adds a new supplier. (from addNewSupplier_viewProductDetails)', async () => {
  fetchMock.post('/api/suppliers', { status: 201, body: { id: 1, name: 'New Supplier' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.change(screen.getByTestId('supplier-name'), { target: { value: 'New Supplier' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-supplier-button')); });

  expect(fetchMock.called('/api/suppliers')).toBe(true);
  expect(screen.getByText('New Supplier')).toBeInTheDocument();
}, 10000);

test('Fails to add a new supplier with server error. (from addNewSupplier_viewProductDetails)', async () => {
  fetchMock.post('/api/suppliers', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.change(screen.getByTestId('supplier-name'), { target: { value: 'New Supplier' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-supplier-button')); });

  expect(fetchMock.called('/api/suppliers')).toBe(true);
  expect(screen.getByText('Failed to add supplier')).toBeInTheDocument();
}, 10000);

test('Viewing a product shows all its details correctly. (from addNewSupplier_viewProductDetails)', async () => {
  fetchMock.get('/products/1', { id: 1, name: 'Product Details', stock: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/view details/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/product details/i)).toBeInTheDocument();
}, 10000);

test('Viewing a product shows an error message if the details cannot be fetched. (from addNewSupplier_viewProductDetails)', async () => {
  fetchMock.get('/products/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/view details/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/error fetching product details/i)).toBeInTheDocument();
}, 10000);

