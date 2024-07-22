import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './generateShoppingList';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Generate Shopping List successfully', async () => {
  fetchMock.post('/api/recipe/1/shopping-list', { body: { message: 'Shopping list generated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shopping list generated')).toBeInTheDocument();
}, 10000);

test('Generate Shopping List failure shows error message', async () => {
  fetchMock.post('/api/recipe/1/shopping-list', { body: { message: 'Error generating shopping list' }, status: 500 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error generating shopping list')).toBeInTheDocument();
}, 10000);

