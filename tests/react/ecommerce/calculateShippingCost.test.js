import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Cart from './calculateShippingCost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculateShippingCost: successfully calculate shipping costs', async () => {
  fetchMock.get('/api/cart/shipping', { status: 200, body: { shipping: '15.00' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Shipping: $15.00')).toBeInTheDocument();  
}, 10000);

test('calculateShippingCost: fail to calculate shipping costs with error message', async () => {
  fetchMock.get('/api/cart/shipping', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-shipping')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate shipping')).toBeInTheDocument();  
}, 10000);

