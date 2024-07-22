import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Products from './FilterByPriceRange';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('filters by price range successfully', async () => {
  fetchMock.get('/api/products?minPrice=100&maxPrice=500', { products: [{ id: 1, name: 'Laptop' }] });

  await act(async () => { render(<MemoryRouter><Products /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('min-price-filter'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('max-price-filter'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-price-filter')); });

  expect(fetchMock.called('/api/products?minPrice=100&maxPrice=500')).toBe(true);
  expect(screen.getByText('Laptop')).toBeInTheDocument();
}, 10000);

test('fails to filter by price range and shows error', async () => {
  fetchMock.get('/api/products?minPrice=100&maxPrice=500', 500);

  await act(async () => { render(<MemoryRouter><Products /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('min-price-filter'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('max-price-filter'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-price-filter')); });

  expect(fetchMock.called('/api/products?minPrice=100&maxPrice=500')).toBe(true);
  expect(screen.getByText('Error loading products')).toBeInTheDocument();
}, 10000);

