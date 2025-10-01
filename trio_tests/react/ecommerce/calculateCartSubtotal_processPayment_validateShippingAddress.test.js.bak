import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateCartSubtotal_processPayment_validateShippingAddress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('calculateCartSubtotal: successfully calculate cart subtotal', async () => {
  fetchMock.get('/api/cart/subtotal', { status: 200, body: { subtotal: '100.00' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-subtotal')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Subtotal: $100.00')).toBeInTheDocument();  
}, 10000);

test('calculateCartSubtotal: fail to calculate cart subtotal with error message', async () => {
  fetchMock.get('/api/cart/subtotal', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-subtotal')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate subtotal')).toBeInTheDocument();  
}, 10000);

test('Processes payment successfully', async () => {
  fetchMock.post('/api/processPayment', 200);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Process Payment')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Payment processed successfully')).toBeInTheDocument();
}, 10000);

test('Fails to process payment', async () => {
  fetchMock.post('/api/processPayment', 500);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Process Payment')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Payment processing failed')).toBeInTheDocument();
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
