import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecipe_listUsersRecipes_removeRecipeFromFavorites';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully deletes a recipe', async () => {
  fetchMock.delete('/recipes/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe deleted successfully')).toBeInTheDocument();
}, 10000);

test('fails to delete a recipe due to server error', async () => {
  fetchMock.delete('/recipes/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete recipe')).toBeInTheDocument();
}, 10000);

test('successfully fetches user\'s added recipes', async () => {
  fetchMock.get('/user-recipes', { recipes: ['Recipe 1', 'Recipe 2'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe 1')).toBeInTheDocument();
  expect(screen.getByText('Recipe 2')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to fetch user\'s added recipes', async () => {
  fetchMock.get('/user-recipes', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('successfully removes a recipe from favorites', async () => {
  fetchMock.post('/remove-from-favorites', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unfavorite-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe removed from favorites')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to remove a recipe from favorites', async () => {
  fetchMock.post('/remove-from-favorites', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unfavorite-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove from favorites')).toBeInTheDocument();
}, 10000);
