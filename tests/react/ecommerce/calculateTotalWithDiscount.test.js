import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Cart from './calculateTotalWithDiscount';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculateTotalWithDiscount: successfully calculate total with discount applied', async () => {
  fetchMock.get('/api/cart/total-discount', { status: 200, body: { total: '80.00' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total-discount')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Total after discount: $80.00')).toBeInTheDocument();  
}, 10000);

test('calculateTotalWithDiscount: fail to calculate total with discount applied with error message', async () => {
  fetchMock.get('/api/cart/total-discount', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><Cart /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-total-discount')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate total after discount')).toBeInTheDocument();  
}, 10000);

