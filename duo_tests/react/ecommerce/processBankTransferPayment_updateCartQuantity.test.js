import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './processBankTransferApp_updateAppQuantity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('process bank transfer payment successfully', async () => {
  fetchMock.post('/api/process-bank-transfer', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-bank-transfer-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('payment-confirmation')).toBeInTheDocument();
}, 10000);

test('fail to process bank transfer payment', async () => {
  fetchMock.post('/api/process-bank-transfer', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-with-bank-transfer-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
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