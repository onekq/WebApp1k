import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './alertOnSupplierContractExpiration_generatePurchaseOrderReceipt_deleteSupplier_linkProductToSupplier';

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

test('Successfully deletes a supplier. (from deleteSupplier_linkProductToSupplier)', async () => {
  fetchMock.delete('/api/suppliers/1', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('delete-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1')).toBe(true);
  expect(screen.queryByText('Test Supplier')).not.toBeInTheDocument();
}, 10000);

test('Fails to delete supplier with server error. (from deleteSupplier_linkProductToSupplier)', async () => {
  fetchMock.delete('/api/suppliers/1', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('delete-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1')).toBe(true);
  expect(screen.getByText('Failed to delete supplier')).toBeInTheDocument();
}, 10000);

test('Successfully links a product to supplier. (from deleteSupplier_linkProductToSupplier)', async () => {
  fetchMock.post('/api/products/link', { status: 200, body: { productId: 1, supplierId: 1, linked: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('link-product-button')); });

  expect(fetchMock.called('/api/products/link')).toBe(true);
  expect(screen.getByText('Product linked to supplier successfully')).toBeInTheDocument();
}, 10000);

test('Fails to link product to supplier. (from deleteSupplier_linkProductToSupplier)', async () => {
  fetchMock.post('/api/products/link', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('link-product-button')); });

  expect(fetchMock.called('/api/products/link')).toBe(true);
  expect(screen.getByText('Failed to link product to supplier')).toBeInTheDocument();
}, 10000);

