import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addNewSupplier_viewProductDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully adds a new supplier.', async () => {
  fetchMock.post('/api/suppliers', { status: 201, body: { id: 1, name: 'New Supplier' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.change(screen.getByTestId('supplier-name'), { target: { value: 'New Supplier' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-supplier-button')); });

  expect(fetchMock.called('/api/suppliers')).toBe(true);
  expect(screen.getByText('New Supplier')).toBeInTheDocument();
}, 10000);

test('Fails to add a new supplier with server error.', async () => {
  fetchMock.post('/api/suppliers', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.change(screen.getByTestId('supplier-name'), { target: { value: 'New Supplier' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-supplier-button')); });

  expect(fetchMock.called('/api/suppliers')).toBe(true);
  expect(screen.getByText('Failed to add supplier')).toBeInTheDocument();
}, 10000);

test('Viewing a product shows all its details correctly.', async () => {
  fetchMock.get('/products/1', { id: 1, name: 'Product Details', stock: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/view details/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/product details/i)).toBeInTheDocument();
}, 10000);

test('Viewing a product shows an error message if the details cannot be fetched.', async () => {
  fetchMock.get('/products/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/view details/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/error fetching product details/i)).toBeInTheDocument();
}, 10000);