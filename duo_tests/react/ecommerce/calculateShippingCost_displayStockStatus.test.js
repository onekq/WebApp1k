import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateShippingCost_displayStockStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculateShippingCost: successfully calculate shipping costs', async () => {
  fetchMock.get('/api/cart/shipping', { status: 200, body: { shipping: '15.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Shipping: $15.00')).toBeInTheDocument();  
}, 10000);

test('calculateShippingCost: fail to calculate shipping costs with error message', async () => {
  fetchMock.get('/api/cart/shipping', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate shipping')).toBeInTheDocument();  
}, 10000);

test('displays product stock status successfully', async () => {
  fetchMock.get('/api/products/1', { id: 1, name: 'Product 1', stock: 'In Stock' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('In Stock')).toBeInTheDocument();
}, 10000);

test('fails to display product stock status and shows error', async () => {
  fetchMock.get('/api/products/1', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);