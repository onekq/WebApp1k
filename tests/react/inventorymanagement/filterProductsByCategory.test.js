import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterProductsByCategory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filtering products by category shows only relevant products.', async () => {
  fetchMock.get('/products?category=Category1', { products: [{ id: 1, category: 'Category1', name: 'Product1' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/filter by category/i), { target: { value: 'Category1' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/filter/i)); });

  expect(fetchMock.calls('/products?category=Category1')).toHaveLength(1);
  expect(screen.getByText(/product1/i)).toBeInTheDocument();
}, 10000);

test('Filtering products by category shows a message if no products are found.', async () => {
  fetchMock.get('/products?category=NoCategory', { products: [] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/filter by category/i), { target: { value: 'NoCategory' }}); });
  await act(async () => { fireEvent.click(screen.getByText(/filter/i)); });

  expect(fetchMock.calls('/products?category=NoCategory')).toHaveLength(1);
  expect(screen.getByText(/no products found/i)).toBeInTheDocument();
}, 10000);

