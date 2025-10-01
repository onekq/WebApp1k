import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customerLoyaltyPoints_productVariantManagement_removeFromCart';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Customer Loyalty Points success awards points', async () => {
  fetchMock.post('/api/orders/1/points', { points: 10 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Award Points')); });

  expect(fetchMock.calls('/api/orders/1/points').length).toBe(1);
  expect(screen.getByText('10 points awarded')).toBeInTheDocument();
}, 10000);

test('Customer Loyalty Points failure shows error message', async () => {
  fetchMock.post('/api/orders/1/points', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Award Points')); });

  expect(screen.getByText('Error awarding points')).toBeInTheDocument();
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

test('Removing a product from the cart succeeds.', async () => {
  fetchMock.delete('/api/cart/1', { status: 200, body: { message: 'Removed from cart successfully' } });

  await act(async () => { render(<MemoryRouter><CartPage /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Cart')); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Removed from cart successfully')).toBeInTheDocument();
}, 10000);

test('Removing a product from the cart fails with error message.', async () => {
  fetchMock.delete('/api/cart/1', { status: 400, body: { message: 'Failed to remove from cart' } });

  await act(async () => { render(<MemoryRouter><CartPage /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Remove from Cart')); });

  expect(fetchMock.calls('/api/cart/1').length).toBe(1);
  expect(screen.getByText('Failed to remove from cart')).toBeInTheDocument();
}, 10000);
