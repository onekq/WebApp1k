import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Products from './FilterByBrand';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('filters by brand successfully', async () => {
  fetchMock.get('/api/products?brand=sony', { products: [{ id: 1, name: 'PlayStation' }] });

  await act(async () => { render(<MemoryRouter><Products /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('brand-filter'), { target: { value: 'sony' } }); });

  expect(fetchMock.called('/api/products?brand=sony')).toBe(true);
  expect(screen.getByText('PlayStation')).toBeInTheDocument();
}, 10000);

test('fails to filter by brand and shows error', async () => {
  fetchMock.get('/api/products?brand=unknown', 404);

  await act(async () => { render(<MemoryRouter><Products /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('brand-filter'), { target: { value: 'unknown' } }); });

  expect(fetchMock.called('/api/products?brand=unknown')).toBe(true);
  expect(screen.getByText('No products found')).toBeInTheDocument();
}, 10000);

