import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateTaxes_updateProductStock';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculateTaxes: successfully calculate taxes', async () => {
  fetchMock.get('/api/cart/taxes', { status: 200, body: { taxes: '8.00' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-taxes')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Taxes: $8.00')).toBeInTheDocument();  
}, 10000);

test('calculateTaxes: fail to calculate taxes with error message', async () => {
  fetchMock.get('/api/cart/taxes', { status: 500, body: { message: 'Error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-taxes')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to calculate taxes')).toBeInTheDocument();  
}, 10000);

test('Updates product stock successfully', async () => {
  fetchMock.patch('/api/updateProductStock', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Update Product Stock')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Product stock updated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to update product stock', async () => {
  fetchMock.patch('/api/updateProductStock', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Update Product Stock')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update product stock')).toBeInTheDocument();
}, 10000);