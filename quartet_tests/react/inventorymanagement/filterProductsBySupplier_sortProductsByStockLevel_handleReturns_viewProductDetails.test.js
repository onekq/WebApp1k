import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterProductsBySupplier_sortProductsByStockLevel_handleReturns_viewProductDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filtering products by supplier shows only relevant products. (from filterProductsBySupplier_sortProductsByStockLevel)', async () => {
  fetchMock.get('/products?supplier=Supplier1', { products: [{ id: 1, supplier: 'Supplier1', name: 'Product by Supplier' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/filter by supplier/i), { target: { value: 'Supplier1' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/filter/i)); });

  expect(fetchMock.calls('/products?supplier=Supplier1')).toHaveLength(1);
  expect(screen.getByText(/product by supplier/i)).toBeInTheDocument();
}, 10000);

test('Filtering products by supplier shows a message if no products are found. (from filterProductsBySupplier_sortProductsByStockLevel)', async () => {
  fetchMock.get('/products?supplier=NoSupplier', { products: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/filter by supplier/i), { target: { value: 'NoSupplier' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/filter/i)); });

  expect(fetchMock.calls('/products?supplier=NoSupplier')).toHaveLength(1);
  expect(screen.getByText(/no products found/i)).toBeInTheDocument();
}, 10000);

test('Sorting products by stock level orders them numerically. (from filterProductsBySupplier_sortProductsByStockLevel)', async () => {
  fetchMock.get('/products?sort=stock', { products: [{ id: 1, stock: 5, name: 'Low Stock Product' }, { id: 2, stock: 100, name: 'High Stock Product' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/sort by stock level/i)); });

  expect(fetchMock.calls('/products?sort=stock')).toHaveLength(1);
  expect(screen.getByText(/low stock product/i)).toBeInTheDocument();
}, 10000);

test('Sorting products by stock level shows an error message if failed. (from filterProductsBySupplier_sortProductsByStockLevel)', async () => {
  fetchMock.get('/products?sort=stock', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/sort by stock level/i)); });

  expect(fetchMock.calls('/products?sort=stock')).toHaveLength(1);
  expect(screen.getByText(/error sorting products/i)).toBeInTheDocument();
}, 10000);

test('Ensure handling returns updates inventory levels and order status correctly. (from handleReturns_viewProductDetails)', async () => {
  fetchMock.post('/api/returns', { status: 200, body: { success: true, newStockLevel: 105 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('returnInput'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitReturn')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('newStockLevel')).toHaveTextContent('105');
}, 10000);

test('Viewing a product shows all its details correctly. (from handleReturns_viewProductDetails)', async () => {
  fetchMock.get('/products/1', { id: 1, name: 'Product Details', stock: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/view details/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/product details/i)).toBeInTheDocument();
}, 10000);

test('Viewing a product shows an error message if the details cannot be fetched. (from handleReturns_viewProductDetails)', async () => {
  fetchMock.get('/products/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/view details/i)); });

  expect(fetchMock.calls('/products/1')).toHaveLength(1);
  expect(screen.getByText(/error fetching product details/i)).toBeInTheDocument();
}, 10000);

