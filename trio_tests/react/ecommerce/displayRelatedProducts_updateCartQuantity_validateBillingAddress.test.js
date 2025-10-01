import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './displayRelatedProducts_updateCartQuantity_validateBillingAddress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('displays related products successfully', async () => {
  fetchMock.get('/api/products/1/related', { products: [{ id: 2, name: 'Related Product' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1/related')).toBe(true);
  expect(screen.getByText('Related Product')).toBeInTheDocument();
}, 10000);

test('fails to display related products and shows error', async () => {
  fetchMock.get('/api/products/1/related', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1/related')).toBe(true);
  expect(screen.getByText('No related products found')).toBeInTheDocument();
}, 10000);

test('updateCartQuantity: successfully update product quantity in cart', async () => {
  fetchMock.put('/api/cart/1', { status: 200, body: { message: 'Updated' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cart-quantity'), { target: { value: '3' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-quantity')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Quantity updated successfully')).toBeInTheDocument();  
}, 10000);

test('updateCartQuantity: fail to update product quantity in cart with error message', async () => {
  fetchMock.put('/api/cart/1', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cart-quantity'), { target: { value: '3' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-quantity')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update quantity')).toBeInTheDocument();  
}, 10000);

test('Validates billing address successfully', async () => {
  fetchMock.post('/api/validateBillingAddress', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Billing Address'), { target: { value: '456 Elm St' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Billing')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Billing address validated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to validate billing address with invalid data', async () => {
  fetchMock.post('/api/validateBillingAddress', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Billing Address'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Billing')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid billing address')).toBeInTheDocument();
}, 10000);
