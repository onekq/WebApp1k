import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './viewCart';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('displays cart details correctly.', async () => {
  fetchMock.get('/api/cart', { body: { items: ['item1', 'item2'] } });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Cart')); });

  expect(fetchMock.calls('/api/cart').length).toEqual(1);
  expect(screen.getByText('item1')).toBeInTheDocument();
  expect(screen.getByText('item2')).toBeInTheDocument();
}, 10000);

test('displays error message on fetching cart failure.', async () => {
  fetchMock.get('/api/cart', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Cart')); });

  expect(fetchMock.calls('/api/cart').length).toEqual(1);
  expect(screen.getByText('Failed to fetch cart details')).toBeInTheDocument();
}, 10000);

