import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Cart from './applyDiscountCode';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('applyDiscountCode: successfully apply discount code to cart', async () => {
  fetchMock.post('/api/cart/discount', { status: 200, body: { message: 'Discount Applied' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code'), { target: { value: 'DISCOUNT2023' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-discount')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Discount Applied successfully')).toBeInTheDocument();  
}, 10000);

test('applyDiscountCode: fail to apply discount code to cart with error message', async () => {
  fetchMock.post('/api/cart/discount', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discount-code'), { target: { value: 'DISCOUNT2023' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-discount')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to apply discount')).toBeInTheDocument();  
}, 10000);

