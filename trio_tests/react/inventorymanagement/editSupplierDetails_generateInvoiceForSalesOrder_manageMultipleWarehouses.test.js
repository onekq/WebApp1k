import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editSupplierDetails_generateInvoiceForSalesOrder_manageMultipleWarehouses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully edits supplier details.', async () => {
  fetchMock.put('/api/suppliers/1', { status: 200, body: { id: 1, name: 'Updated Supplier' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.change(screen.getByTestId('edit-supplier-name'), { target: { value: 'Updated Supplier' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1')).toBe(true);
  expect(screen.getByText('Updated Supplier')).toBeInTheDocument();
}, 10000);

test('Fails to edit supplier details with server error.', async () => {
  fetchMock.put('/api/suppliers/1', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.change(screen.getByTestId('edit-supplier-name'), { target: { value: 'Updated Supplier' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-supplier-button')); });

  expect(fetchMock.called('/api/suppliers/1')).toBe(true);
  expect(screen.getByText('Failed to update supplier')).toBeInTheDocument();
}, 10000);

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

test('Reflects correct stock levels per warehouse on success', async () => {
  fetchMock.get('/api/warehouses', { warehouse1: 100, warehouse2: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/warehouses').length).toBe(1);
  expect(screen.getByText(/Warehouse1: 100/i)).toBeInTheDocument();
  expect(screen.getByText(/Warehouse2: 200/i)).toBeInTheDocument();
}, 10000);

test('Shows error message on failure when fetching warehouse data', async () => {
  fetchMock.get('/api/warehouses', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/warehouses').length).toBe(1);
  expect(screen.getByText(/Error fetching warehouse data/i)).toBeInTheDocument();
}, 10000);
