import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './alertOnSupplierContractExpiration_generatePurchaseOrderReceipt_addNewSupplier_viewProductDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully alerts on supplier contract expiration. (from alertOnSupplierContractExpiration_generatePurchaseOrderReceipt)', async () => {
  fetchMock.get('/api/suppliers/1/contract-expiration', { status: 200, body: { message: 'Contract is about to expire' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('check-contract-expiration-button')); });

  expect(fetchMock.called('/api/suppliers/1/contract-expiration')).toBe(true);
  expect(screen.getByText('Contract is about to expire')).toBeInTheDocument();
}, 10000);

test('Fails to alert on supplier contract expiration. (from alertOnSupplierContractExpiration_generatePurchaseOrderReceipt)', async () => {
  fetchMock.get('/api/suppliers/1/contract-expiration', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('check-contract-expiration-button')); });

  expect(fetchMock.called('/api/suppliers/1/contract-expiration')).toBe(true);
  expect(screen.getByText('Failed to check contract expiration')).toBeInTheDocument();
}, 10000);

test('Ensure generating a purchase order receipt includes all relevant details. (from alertOnSupplierContractExpiration_generatePurchaseOrderReceipt)', async () => {
  fetchMock.get('/api/purchase-receipt', { status: 200, body: { receipt: { id: 1, total: 200, items: [{ item: 'Product B', quantity: 10 }] } } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generateReceipt')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product B')).toBeInTheDocument();
  expect(screen.getByText('200')).toBeInTheDocument();
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

