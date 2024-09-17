import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './listSavedRecipes_saveShoppingList';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully fetches user\'s saved recipes', async () => {
  fetchMock.get('/saved-recipes', { recipes: ['Recipe 1', 'Recipe 2'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe 1')).toBeInTheDocument();
  expect(screen.getByText('Recipe 2')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to fetch user\'s saved recipes', async () => {
  fetchMock.get('/saved-recipes', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch saved recipes')).toBeInTheDocument();
}, 10000);

test('Save Shopping List successfully', async () => {
  fetchMock.post('/api/shopping-list/save', { body: { message: 'Shopping list saved' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shopping list saved')).toBeInTheDocument();
}, 10000);

test('Save Shopping List failure shows error message', async () => {
  fetchMock.post('/api/shopping-list/save', { body: { message: 'Error saving shopping list' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error saving shopping list')).toBeInTheDocument();
}, 10000);