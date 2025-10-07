import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sortProductsByStockLevel_trackInventoryByLocation_editSupplierDetails_totalInventoryValue';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Sorting products by stock level orders them numerically. (from sortProductsByStockLevel_trackInventoryByLocation)', async () => {
  fetchMock.get('/products?sort=stock', { products: [{ id: 1, stock: 5, name: 'Low Stock Product' }, { id: 2, stock: 100, name: 'High Stock Product' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/sort by stock level/i)); });

  expect(fetchMock.calls('/products?sort=stock')).toHaveLength(1);
  expect(screen.getByText(/low stock product/i)).toBeInTheDocument();
}, 10000);

test('Sorting products by stock level shows an error message if failed. (from sortProductsByStockLevel_trackInventoryByLocation)', async () => {
  fetchMock.get('/products?sort=stock', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/sort by stock level/i)); });

  expect(fetchMock.calls('/products?sort=stock')).toHaveLength(1);
  expect(screen.getByText(/error sorting products/i)).toBeInTheDocument();
}, 10000);

test('Shows accurate stock levels per location (from sortProductsByStockLevel_trackInventoryByLocation)', async () => {
  fetchMock.get('/api/inventory/location', { location1: 30, location2: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/inventory/location').length).toBe(1);
  expect(screen.getByText(/Location1: 30/i)).toBeInTheDocument();
  expect(screen.getByText(/Location2: 50/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when fetching inventory by location (from sortProductsByStockLevel_trackInventoryByLocation)', async () => {
  fetchMock.get('/api/inventory/location', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/inventory/location').length).toBe(1);
  expect(screen.getByText(/Error fetching inventory by location/i)).toBeInTheDocument();
}, 10000);

test('Successfully edits supplier details. (from editSupplierDetails_totalInventoryValue)', async () => {
  fetchMock.put('/api/suppliers/1', { status: 200, body: { id: 1, name: 'Updated Supplier' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.change(screen.getByTestId('edit-supplier-name'), { target: { value: 'Updated Supplier' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1')).toBe(true);
  expect(screen.getByText('Updated Supplier')).toBeInTheDocument();
}, 10000);

test('Fails to edit supplier details with server error. (from editSupplierDetails_totalInventoryValue)', async () => {
  fetchMock.put('/api/suppliers/1', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.change(screen.getByTestId('edit-supplier-name'), { target: { value: 'Updated Supplier' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1')).toBe(true);
  expect(screen.getByText('Failed to update supplier')).toBeInTheDocument();
}, 10000);

test('Calculates total inventory value successfully. (from editSupplierDetails_totalInventoryValue)', async () => {
  fetchMock.post('/api/total-inventory-value', { body: { status: 'success', data: { value: 10000 }}});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Inventory Value: $10,000')).toBeInTheDocument();
}, 10000);

test('Fails to calculate total inventory value due to server error. (from editSupplierDetails_totalInventoryValue)', async () => {
  fetchMock.post('/api/total-inventory-value', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-value')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

