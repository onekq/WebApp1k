import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './viewOrderHistory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('View Order History success shows order data', async () => {
  fetchMock.get('/api/orders', [{ id: 1, product: 'Product 1' }]);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  expect(fetchMock.calls('/api/orders').length).toBe(1);
  
  expect(screen.getByText('Product 1')).toBeInTheDocument();
}, 10000);

test('View Order History failure shows error message', async () => {
  fetchMock.get('/api/orders', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  
  expect(screen.getByText('Error loading order history')).toBeInTheDocument();
}, 10000);

