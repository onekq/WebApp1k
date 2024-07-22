import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Order from './updateProductStock';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Updates product stock successfully', async () => {
  fetchMock.patch('/api/updateProductStock', 200);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Update Product Stock')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Product stock updated successfully')).toBeInTheDocument();
}, 10000);

test('Fails to update product stock', async () => {
  fetchMock.patch('/api/updateProductStock', 500);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Update Product Stock')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update product stock')).toBeInTheDocument();
}, 10000);

