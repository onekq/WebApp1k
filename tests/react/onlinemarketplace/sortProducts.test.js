import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SortProducts from './sortProducts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Sort Products successfully sorts products.', async () => {
  fetchMock.get('/api/sort', { status: 200, body: { results: ['Product A', 'Product B'] } });

  await act(async () => { render(<MemoryRouter><SortProducts /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Product A')).toBeInTheDocument();
}, 10000);

test('Sort Products fails and displays error message.', async () => {
  fetchMock.get('/api/sort', { status: 500 });

  await act(async () => { render(<MemoryRouter><SortProducts /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort products')).toBeInTheDocument();
}, 10000);

