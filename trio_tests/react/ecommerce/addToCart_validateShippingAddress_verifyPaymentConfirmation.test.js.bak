import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addToCart_validateShippingAddress_verifyPaymentConfirmation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('addToCart: successfully add a product to the cart', async () => {
  fetchMock.post('/api/cart', { status: 200, body: { message: 'Added' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Added successfully')).toBeInTheDocument();  
}, 10000);

test('addToCart: fail to add a product to the cart with error message', async () => {
  fetchMock.post('/api/cart', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to add item to cart')).toBeInTheDocument();  
}, 10000);

test('Validates shipping address successfully', async () => {
  fetchMock.post('/api/validateShippingAddress', 200);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Shipping Address'), { target: { value: '123 Main St' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Shipping address validated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to validate shipping address with invalid data', async () => {
  fetchMock.post('/api/validateShippingAddress', 400);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Shipping Address'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid shipping address')).toBeInTheDocument();
}, 10000);

test('verify payment confirmation successfully', async () => {
  fetchMock.get('/api/verify-payment-confirmation', { confirmed: true });

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('verify-payment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment confirmed')).toBeInTheDocument();
}, 10000);

test('fail to confirm payment', async () => {
  fetchMock.get('/api/verify-payment-confirmation', 500);

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('verify-payment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to confirm payment')).toBeInTheDocument();
}, 10000);
