import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './placeOrder_productDetails_productVariantManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('places an order successfully.', async () => {
  fetchMock.post('/api/order', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Place Order')); });

  expect(fetchMock.calls('/api/order').length).toEqual(1);
  expect(screen.getByText('Order placed successfully')).toBeInTheDocument();
}, 10000);

test('displays error on failing to place order.', async () => {
  fetchMock.post('/api/order', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Place Order')); });

  expect(fetchMock.calls('/api/order').length).toEqual(1);
  expect(screen.getByText('Order placement failed')).toBeInTheDocument();
}, 10000);

test('Product details retrieval and display succeed.', async () => {
  fetchMock.get('/api/products/1', { status: 200, body: { id: 1, name: 'Sample Product' } });

  await act(async () => { render(<MemoryRouter><ProductDetails productId={1} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/products/1').length).toBe(1);
  expect(screen.getByText('Sample Product')).toBeInTheDocument();
}, 10000);

test('Product details retrieval fails with error message.', async () => {
  fetchMock.get('/api/products/1', { status: 404, body: { message: 'Product not found' } });

  await act(async () => { render(<MemoryRouter><ProductDetails productId={1} /></MemoryRouter>); });

  expect(fetchMock.calls('/api/products/1').length).toBe(1);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);

test('Managing product variants succeeds.', async () => {
  fetchMock.post('/api/products/1/variants', { status: 200, body: { id: 1, size: 'M', color: 'Red' } });

  await act(async () => { render(<MemoryRouter><VariantManagement productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Size'), { target: { value: 'M' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Variant')); });

  expect(fetchMock.calls('/api/products/1/variants').length).toBe(1);
  expect(screen.getByText('Variant added successfully')).toBeInTheDocument();
}, 10000);

test('Managing product variants fails with error message.', async () => {
  fetchMock.post('/api/products/1/variants', { status: 400, body: { message: 'Invalid variant details' } });

  await act(async () => { render(<MemoryRouter><VariantManagement productId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Size'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Variant')); });

  expect(fetchMock.calls('/api/products/1/variants').length).toBe(1);
  expect(screen.getByText('Invalid variant details')).toBeInTheDocument();
}, 10000);
