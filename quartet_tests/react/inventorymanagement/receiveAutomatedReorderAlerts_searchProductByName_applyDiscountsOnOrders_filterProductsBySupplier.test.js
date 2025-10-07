import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './receiveAutomatedReorderAlerts_searchProductByName_applyDiscountsOnOrders_filterProductsBySupplier';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Validate applying discounts on orders reduces the total amount correctly. (from applyDiscountsOnOrders_filterProductsBySupplier)', async () => {
  fetchMock.post('/api/discount', { status: 200, body: { success: true, discountedAmount: 90 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discountInput'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('applyDiscount')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('discountedAmount')).toHaveTextContent('90');
}, 10000);

test('Filtering products by supplier shows only relevant products. (from applyDiscountsOnOrders_filterProductsBySupplier)', async () => {
  fetchMock.get('/products?supplier=Supplier1', { products: [{ id: 1, supplier: 'Supplier1', name: 'Product by Supplier' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/filter by supplier/i), { target: { value: 'Supplier1' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/filter/i)); });

  expect(fetchMock.calls('/products?supplier=Supplier1')).toHaveLength(1);
  expect(screen.getByText(/product by supplier/i)).toBeInTheDocument();
}, 10000);

test('Filtering products by supplier shows a message if no products are found. (from applyDiscountsOnOrders_filterProductsBySupplier)', async () => {
  fetchMock.get('/products?supplier=NoSupplier', { products: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/filter by supplier/i), { target: { value: 'NoSupplier' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/filter/i)); });

  expect(fetchMock.calls('/products?supplier=NoSupplier')).toHaveLength(1);
  expect(screen.getByText(/no products found/i)).toBeInTheDocument();
}, 10000);

