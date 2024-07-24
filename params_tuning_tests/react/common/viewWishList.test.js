import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './viewWishList';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('View Wish List success displays wish list items', async () => {
  fetchMock.get('/api/wishlist', [{ id: 1, product: 'Product 1' }]);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });

  expect(fetchMock.calls('/api/wishlist').length).toBe(1);
  expect(screen.getByText('Product 1')).toBeInTheDocument();
}, 10000);

test('View Wish List failure shows error message', async () => {
  fetchMock.get('/api/wishlist', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });

  expect(screen.getByText('Error loading wish list')).toBeInTheDocument();
}, 10000);