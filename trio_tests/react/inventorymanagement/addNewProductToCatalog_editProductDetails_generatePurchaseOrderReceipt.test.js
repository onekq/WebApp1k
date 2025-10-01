import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addNewProductToCatalog_editProductDetails_generatePurchaseOrderReceipt';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Adding a new product to the catalog updates the inventory list correctly.', async () => {
  fetchMock.post('/products', { id: 1, name: "New Product" });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'New Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/add product/i)); });

  expect(fetchMock.calls('/products')).toHaveLength(1);
  expect(screen.getByText(/new product/i)).toBeInTheDocument();
}, 10000);

test('Adding a new product to the catalog shows an error message if there is a failure.', async () => {
  fetchMock.post('/products', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'New Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/add product/i)); });

  expect(fetchMock.calls('/products')).toHaveLength(1);
  expect(screen.getByText(/error adding product/i)).toBeInTheDocument();
}, 10000);

test('Editing product details updates the inventory list accurately.', async () => {
  fetchMock.put('/products/1', { id: 1, name: 'Updated Product' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Updated Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/save changes/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/updated product/i)).toBeInTheDocument();
}, 10000);

test('Editing product details shows an error message if the update fails.', async () => {
  fetchMock.put('/products/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'Updated Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/save changes/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/error saving changes/i)).toBeInTheDocument();
}, 10000);

test('Ensure generating a purchase order receipt includes all relevant details.', async () => {
  fetchMock.get('/api/purchase-receipt', { status: 200, body: { receipt: { id: 1, total: 200, items: [{ item: 'Product B', quantity: 10 }] } } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generateReceipt')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product B')).toBeInTheDocument();
  expect(screen.getByText('200')).toBeInTheDocument();
}, 10000);

test('Generating a purchase order receipt doesn\'t show details due to error.', async () => {
  fetchMock.get('/api/purchase-receipt', { status: 500, body: { error: 'Internal Server Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('generateReceipt')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error generating receipt.')).toBeInTheDocument();
}, 10000);
