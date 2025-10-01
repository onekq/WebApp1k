import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editShoppingList_filterRecipesByIngredient_shareRecipeLink';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Edit Shopping List successfully', async () => {
  fetchMock.put('/api/shopping-list/1', { body: { message: 'Shopping list updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Edit Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shopping list updated')).toBeInTheDocument();
}, 10000);

test('Edit Shopping List failure shows error message', async () => {
  fetchMock.put('/api/shopping-list/1', { body: { message: 'Error updating shopping list' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Edit Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error updating shopping list')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by specific ingredients - success', async () => {
  fetchMock.get('/api/recipes?ingredient=tomato', { recipes: [{ id: 2, title: 'Tomato Pasta' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by ingredient...'), { target: { value: 'tomato' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tomato Pasta')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by specific ingredients - failure', async () => {
  fetchMock.get('/api/recipes?ingredient=tomato', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by ingredient...'), { target: { value: 'tomato' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('Share Recipe Link successfully', async () => {
  fetchMock.post('/api/recipe/1/share', { body: { message: 'Recipe link shared' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Recipe Link')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe link shared')).toBeInTheDocument();
}, 10000);

test('Share Recipe Link failure shows error message', async () => {
  fetchMock.post('/api/recipe/1/share', { body: { message: 'Error sharing recipe link' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Recipe Link')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error sharing recipe link')).toBeInTheDocument();
}, 10000);
