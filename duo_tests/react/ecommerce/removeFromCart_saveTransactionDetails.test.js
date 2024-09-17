import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removeFromApp_saveTransactionDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('removeFromCart: successfully remove a product from the cart', async () => {
  fetchMock.delete('/api/cart/1', { status: 200, body: { message: 'Removed' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-from-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Removed successfully')).toBeInTheDocument();  
}, 10000);

test('removeFromCart: fail to remove a product from the cart with error message', async () => {
  fetchMock.delete('/api/cart/1', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-from-cart')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to remove item from cart')).toBeInTheDocument();  
}, 10000);

test('save transaction details successfully', async () => {
  fetchMock.post('/api/save-transaction', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-transaction-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Transaction saved successfully')).toBeInTheDocument();
}, 10000);

test('fail to save transaction details', async () => {
  fetchMock.post('/api/save-transaction', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-transaction-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save transaction')).toBeInTheDocument();
}, 10000);