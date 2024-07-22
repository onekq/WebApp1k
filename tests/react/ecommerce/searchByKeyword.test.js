import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Products from './SearchByKeyword';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('searches by keyword successfully', async () => {
  fetchMock.get('/api/products?search=phone', { products: [{ id: 1, name: 'Smartphone' }] });

  await act(async () => { render(<MemoryRouter><Products /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('keyword-search'), { target: { value: 'phone' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.called('/api/products?search=phone')).toBe(true);
  expect(screen.getByText('Smartphone')).toBeInTheDocument();
}, 10000);

test('fails to search by keyword and shows error', async () => {
  fetchMock.get('/api/products?search=unknown', 404);

  await act(async () => { render(<MemoryRouter><Products /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('keyword-search'), { target: { value: 'unknown' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.called('/api/products?search=unknown')).toBe(true);
  expect(screen.getByText('No products found')).toBeInTheDocument();
}, 10000);

