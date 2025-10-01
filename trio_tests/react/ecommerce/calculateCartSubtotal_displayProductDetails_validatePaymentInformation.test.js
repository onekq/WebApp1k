import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateCartSubtotal_displayProductDetails_validatePaymentInformation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('calculateCartSubtotal: successfully calculate cart subtotal', async () => {
  fetchMock.get('/api/cart/subtotal', { status: 200, body: { subtotal: '100.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-subtotal')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Subtotal: $100.00')).toBeInTheDocument();  
}, 10000);

test('calculateCartSubtotal: fail to calculate cart subtotal with error message', async () => {
  fetchMock.get('/api/cart/subtotal', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-subtotal')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate subtotal')).toBeInTheDocument();  
}, 10000);

test('displays product details successfully', async () => {
  fetchMock.get('/api/products/1', { id: 1, name: 'Product 1', description: 'A great product', price: 100, rating: 4 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('A great product')).toBeInTheDocument();
}, 10000);

test('fails to display product details and shows error', async () => {
  fetchMock.get('/api/products/1', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Product 1')); });

  expect(fetchMock.called('/api/products/1')).toBe(true);
  expect(screen.getByText('Product not found')).toBeInTheDocument();
}, 10000);

test('Validates payment information successfully', async () => {
  fetchMock.post('/api/validatePaymentInformation', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Card Number'), { target: { value: '4111111111111111' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Payment')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Payment information validated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to validate payment information with invalid card number', async () => {
  fetchMock.post('/api/validatePaymentInformation', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Card Number'), { target: { value: '1234' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Payment')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid payment information')).toBeInTheDocument();
}, 10000);
