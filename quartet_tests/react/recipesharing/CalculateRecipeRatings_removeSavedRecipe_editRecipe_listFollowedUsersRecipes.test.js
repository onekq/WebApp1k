import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './CalculateRecipeRatings_removeSavedRecipe_editRecipe_listFollowedUsersRecipes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully calculates the average rating of a recipe (from CalculateRecipeRatings_removeSavedRecipe)', async () => {
  fetchMock.get('/recipe-rating', { rating: 4.5 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Average rating: 4.5')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to calculate the average rating of a recipe (from CalculateRecipeRatings_removeSavedRecipe)', async () => {
  fetchMock.get('/recipe-rating', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to calculate rating')).toBeInTheDocument();
}, 10000);

test('successfully removes a saved recipe from user profile (from CalculateRecipeRatings_removeSavedRecipe)', async () => {
  fetchMock.post('/remove-saved-recipe', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe removed successfully')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to remove a saved recipe (from CalculateRecipeRatings_removeSavedRecipe)', async () => {
  fetchMock.post('/remove-saved-recipe', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove recipe')).toBeInTheDocument();
}, 10000);

test('successfully edits an existing recipe (from editRecipe_listFollowedUsersRecipes)', async () => {
  fetchMock.put('/recipes/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Recipe Name'), { target: { value: 'Updated Recipe' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Changes')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe updated successfully')).toBeInTheDocument();
}, 10000);

test('fails to edit a recipe due to server error (from editRecipe_listFollowedUsersRecipes)', async () => {
  fetchMock.put('/recipes/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Changes')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update recipe')).toBeInTheDocument();
}, 10000);

test('Ensure users can view recipes added by users they follow - success (from editRecipe_listFollowedUsersRecipes)', async () => {
  fetchMock.get('/api/recipes?followed=true', { recipes: [{ id: 10, title: 'Followed User Recipe' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Followed Users\' Recipes')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Followed User Recipe')).toBeInTheDocument();
}, 10000);

test('Ensure users can view recipes added by users they follow - failure (from editRecipe_listFollowedUsersRecipes)', async () => {
  fetchMock.get('/api/recipes?followed=true', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Followed Users\' Recipes')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

