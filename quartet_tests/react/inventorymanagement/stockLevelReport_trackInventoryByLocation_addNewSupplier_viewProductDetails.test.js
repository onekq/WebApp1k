import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './stockLevelReport_trackInventoryByLocation_addNewSupplier_viewProductDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Generates stock level report successfully. (from stockLevelReport_trackInventoryByLocation)', async () => {
  fetchMock.post('/api/stock-level-report', { body: { status: 'success', data: { /* ...expected data... */ }} });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-data')).toBeInTheDocument();
}, 10000);

test('Fails to generate stock level report due to server error. (from stockLevelReport_trackInventoryByLocation)', async () => {
  fetchMock.post('/api/stock-level-report', { status: 500, body: { status: 'error', message: 'Server Error' }});

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('date-range'), { target: { value: '2023-01-01 to 2023-01-31' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('generate-report')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Server Error')).toBeInTheDocument();
}, 10000);

test('Shows accurate stock levels per location (from stockLevelReport_trackInventoryByLocation)', async () => {
  fetchMock.get('/api/inventory/location', { location1: 30, location2: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/inventory/location').length).toBe(1);
  expect(screen.getByText(/Location1: 30/i)).toBeInTheDocument();
  expect(screen.getByText(/Location2: 50/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when fetching inventory by location (from stockLevelReport_trackInventoryByLocation)', async () => {
  fetchMock.get('/api/inventory/location', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/inventory/location').length).toBe(1);
  expect(screen.getByText(/Error fetching inventory by location/i)).toBeInTheDocument();
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

