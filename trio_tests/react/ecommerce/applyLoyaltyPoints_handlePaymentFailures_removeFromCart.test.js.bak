import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyLoyaltyPoints_handlePaymentFailures_removeFromCart';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Applies loyalty points successfully', async () => {
  fetchMock.post('/api/applyLoyaltyPoints', 200);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Loyalty Points')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Loyalty points applied successfully')).toBeInTheDocument();
}, 10000);

test('Fails to apply loyalty points', async () => {
  fetchMock.post('/api/applyLoyaltyPoints', 500);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Loyalty Points')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to apply loyalty points')).toBeInTheDocument();
}, 10000);

test('handle payment failure due to insufficient funds', async () => {
  fetchMock.post('/api/process-payment', { success: false, error: 'Insufficient funds' });

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
}, 10000);

test('handle payment failure with generic error', async () => {
  fetchMock.post('/api/process-payment', 500);

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pay-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Payment failed, please try again')).toBeInTheDocument();
}, 10000);

test('removeFromCart: successfully remove a product from the cart', async () => {
  fetchMock.delete('/api/cart/1', { status: 200, body: { message: 'Removed' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-from-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Removed successfully')).toBeInTheDocument();  
}, 10000);

test('removeFromCart: fail to remove a product from the cart with error message', async () => {
  fetchMock.delete('/api/cart/1', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-from-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to remove item from cart')).toBeInTheDocument();  
}, 10000);
