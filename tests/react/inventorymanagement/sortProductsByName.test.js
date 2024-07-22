import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sortProductsByName';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Sorting products by name orders them alphabetically.', async () => {
  fetchMock.get('/products?sort=name', { products: [{ id: 1, name: 'A Product' }, { id: 2, name: 'B Product' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/sort by name/i)); });

  expect(fetchMock.calls('/products?sort=name')).toHaveLength(1);
  expect(screen.getByText(/a product/i)).toBeInTheDocument();
}, 10000);

test('Sorting products by name shows an error message if failed.', async () => {
  fetchMock.get('/products?sort=name', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/sort by name/i)); });

  expect(fetchMock.calls('/products?sort=name')).toHaveLength(1);
  expect(screen.getByText(/error sorting products/i)).toBeInTheDocument();
}, 10000);

