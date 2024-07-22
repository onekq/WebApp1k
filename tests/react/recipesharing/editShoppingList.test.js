import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './editShoppingList';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Edit Shopping List successfully', async () => {
  fetchMock.put('/api/shopping-list/1', { body: { message: 'Shopping list updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Edit Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shopping list updated')).toBeInTheDocument();
}, 10000);

test('Edit Shopping List failure shows error message', async () => {
  fetchMock.put('/api/shopping-list/1', { body: { message: 'Error updating shopping list' }, status: 500 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Edit Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error updating shopping list')).toBeInTheDocument();
}, 10000);

