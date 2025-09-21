import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterProductsByCategory_manageSupplierContacts_processSalesOrder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Filtering products by category shows only relevant products.', async () => {
  fetchMock.get('/products?category=Category1', { products: [{ id: 1, category: 'Category1', name: 'Product1' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/filter by category/i), { target: { value: 'Category1' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/filter/i)); });

  expect(fetchMock.calls('/products?category=Category1')).toHaveLength(1);
  expect(screen.getByText(/product1/i)).toBeInTheDocument();
}, 10000);

test('Filtering products by category shows a message if no products are found.', async () => {
  fetchMock.get('/products?category=NoCategory', { products: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/filter by category/i), { target: { value: 'NoCategory' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/filter/i)); });

  expect(fetchMock.calls('/products?category=NoCategory')).toHaveLength(1);
  expect(screen.getByText(/no products found/i)).toBeInTheDocument();
}, 10000);

test('Successfully manages supplier contacts.', async () => {
  fetchMock.get('/api/suppliers/1/contacts', { status: 200, body: { contacts: ['Contact1', 'Contact2'] } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('manage-contacts-button')); });

  expect(fetchMock.called('/api/suppliers/1/contacts')).toBe(true);
  expect(screen.getByText('Contact1')).toBeInTheDocument();
  expect(screen.getByText('Contact2')).toBeInTheDocument();
}, 10000);

test('Fails to manage supplier contacts.', async () => {
  fetchMock.get('/api/suppliers/1/contacts', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('manage-contacts-button')); });

  expect(fetchMock.called('/api/suppliers/1/contacts')).toBe(true);
  expect(screen.getByText('Failed to manage contacts')).toBeInTheDocument();
}, 10000);

test('Processing a sales order reduces the stock level appropriately.', async () => {
  fetchMock.post('/api/sales-order', { status: 200, body: { success: true, newStockLevel: 90 } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('orderInput'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitOrder')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('newStockLevel')).toHaveTextContent('90');
}, 10000);

test('Processing a sales order doesn\'t reduce stock level due to error.', async () => {
  fetchMock.post('/api/sales-order', { status: 500, body: { error: 'Internal Server Error' } });
  
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('orderInput'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitOrder')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error processing the sales order.')).toBeInTheDocument();
}, 10000);
