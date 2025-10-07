import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterProductsBySupplier_sortProductsByStockLevel_receiveAutomatedReorderAlerts_searchProductByName';

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

test('Sends automated reorder alert when stock falls below level (from receiveAutomatedReorderAlerts_searchProductByName)', async () => {
  fetchMock.get('/api/stock/monitor', { stock: 10, reorderLevel: 20 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/stock/monitor').length).toBe(1);
  expect(screen.getByText(/Automated reorder alert sent/i)).toBeInTheDocument();
}, 10000);

test('Shows error on failure when sending automated reorder alerts (from receiveAutomatedReorderAlerts_searchProductByName)', async () => {
  fetchMock.get('/api/stock/monitor', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/stock/monitor').length).toBe(1);
  expect(screen.getByText(/Error sending automated reorder alert/i)).toBeInTheDocument();
}, 10000);

test('Searching for a product by name returns the correct product. (from receiveAutomatedReorderAlerts_searchProductByName)', async () => {
  fetchMock.get('/products?name=Existing Product', { products: [{ id: 1, name: 'Existing Product' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/search by name/i), { target: { value: 'Existing Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/search/i)); });

  expect(fetchMock.calls('/products?name=Existing Product')).toHaveLength(1);
  expect(screen.getByText(/existing product/i)).toBeInTheDocument();
}, 10000);

test('Searching for a product by name handles no results correctly. (from receiveAutomatedReorderAlerts_searchProductByName)', async () => {
  fetchMock.get('/products?name=Nonexistent Product', { products: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/search by name/i), { target: { value: 'Nonexistent Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/search/i)); });

  expect(fetchMock.calls('/products?name=Nonexistent Product')).toHaveLength(1);
  expect(screen.getByText(/no products found/i)).toBeInTheDocument();
}, 10000);

