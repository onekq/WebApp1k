import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './searchProductByName';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Searching for a product by name returns the correct product.', async () => {
  fetchMock.get('/products?name=Existing Product', { products: [{ id: 1, name: 'Existing Product' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/search by name/i), { target: { value: 'Existing Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/search/i)); });

  expect(fetchMock.calls('/products?name=Existing Product')).toHaveLength(1);
  expect(screen.getByText(/existing product/i)).toBeInTheDocument();
}, 10000);

test('Searching for a product by name handles no results correctly.', async () => {
  fetchMock.get('/products?name=Nonexistent Product', { products: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/search by name/i), { target: { value: 'Nonexistent Product' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/search/i)); });

  expect(fetchMock.calls('/products?name=Nonexistent Product')).toHaveLength(1);
  expect(screen.getByText(/no products found/i)).toBeInTheDocument();
}, 10000);

