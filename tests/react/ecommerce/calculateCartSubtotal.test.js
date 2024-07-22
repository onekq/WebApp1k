import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Cart from './calculateCartSubtotal';

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

