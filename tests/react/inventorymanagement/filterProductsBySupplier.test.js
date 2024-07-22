import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterProductsBySupplier';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filtering products by supplier shows only relevant products.', async () => {
  fetchMock.get('/products?supplier=Supplier1', { products: [{ id: 1, supplier: 'Supplier1', name: 'Product by Supplier' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/filter by supplier/i), { target: { value: 'Supplier1' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/filter/i)); });

  expect(fetchMock.calls('/products?supplier=Supplier1')).toHaveLength(1);
  expect(screen.getByText(/product by supplier/i)).toBeInTheDocument();
}, 10000);

test('Filtering products by supplier shows a message if no products are found.', async () => {
  fetchMock.get('/products?supplier=NoSupplier', { products: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/filter by supplier/i), { target: { value: 'NoSupplier' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/filter/i)); });

  expect(fetchMock.calls('/products?supplier=NoSupplier')).toHaveLength(1);
  expect(screen.getByText(/no products found/i)).toBeInTheDocument();
}, 10000);

