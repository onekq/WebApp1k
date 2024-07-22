import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import FilterProducts from './filterProducts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter Products successfully filters products.', async () => {
  fetchMock.get('/api/filter', { status: 200, body: { results: ['Filtered Product 1'] } });

  await act(async () => { render(<MemoryRouter><FilterProducts /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-category')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Filtered Product 1')).toBeInTheDocument();
}, 10000);

test('Filter Products fails and displays error message.', async () => {
  fetchMock.get('/api/filter', { status: 500 });

  await act(async () => { render(<MemoryRouter><FilterProducts /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-category')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to apply filters')).toBeInTheDocument();
}, 10000);

