import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecipe_filterRecipesByCuisine_generateShoppingList_ListFollowedUsers';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully deletes a recipe (from deleteRecipe_filterRecipesByCuisine)', async () => {
  fetchMock.delete('/recipes/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe deleted successfully')).toBeInTheDocument();
}, 10000);

test('fails to delete a recipe due to server error (from deleteRecipe_filterRecipesByCuisine)', async () => {
  fetchMock.delete('/recipes/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete recipe')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by cuisine type - success (from deleteRecipe_filterRecipesByCuisine)', async () => {
  fetchMock.get('/api/recipes?cuisine=italian', { recipes: [{ id: 3, title: 'Italian Pizza' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by cuisine...'), { target: { value: 'italian' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Italian Pizza')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by cuisine type - failure (from deleteRecipe_filterRecipesByCuisine)', async () => {
  fetchMock.get('/api/recipes?cuisine=italian', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by cuisine...'), { target: { value: 'italian' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('Generate Shopping List successfully (from generateShoppingList_ListFollowedUsers)', async () => {
  fetchMock.post('/api/recipe/1/shopping-list', { body: { message: 'Shopping list generated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shopping list generated')).toBeInTheDocument();
}, 10000);

test('Generate Shopping List failure shows error message (from generateShoppingList_ListFollowedUsers)', async () => {
  fetchMock.post('/api/recipe/1/shopping-list', { body: { message: 'Error generating shopping list' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error generating shopping list')).toBeInTheDocument();
}, 10000);

test('successfully fetches list of followed users (from generateShoppingList_ListFollowedUsers)', async () => {
  fetchMock.get('/followed-users', { users: ['User 1', 'User 2'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('User 1')).toBeInTheDocument();
  expect(screen.getByText('User 2')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to fetch list of followed users (from generateShoppingList_ListFollowedUsers)', async () => {
  fetchMock.get('/followed-users', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch followed users')).toBeInTheDocument();
}, 10000);

