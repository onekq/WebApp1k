import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateRecipeFields_viewIngredientList_editRecipe_sortRecipesByRating';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully validates required fields for a recipe (from validateRecipeFields_viewIngredientList)', async () => {
  fetchMock.post('/validate-recipe', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recipe-name-input'), { target: { value: 'Recipe 1' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Validation successful')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to validate required fields for a recipe (from validateRecipeFields_viewIngredientList)', async () => {
  fetchMock.post('/validate-recipe', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recipe-name-input'), { target: { value: 'Recipe 1' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Validation failed')).toBeInTheDocument();
}, 10000);

test('View Ingredient List successfully (from validateRecipeFields_viewIngredientList)', async () => {
  fetchMock.get('/api/recipe/1/ingredients', { body: [{ name: 'Salt' }], status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Ingredients')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Salt')).toBeInTheDocument();
}, 10000);

test('View Ingredient List failure shows error message (from validateRecipeFields_viewIngredientList)', async () => {
  fetchMock.get('/api/recipe/1/ingredients', { body: { message: 'Error fetching ingredients' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Ingredients')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching ingredients')).toBeInTheDocument();
}, 10000);

test('successfully edits an existing recipe (from editRecipe_sortRecipesByRating)', async () => {
  fetchMock.put('/recipes/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Recipe Name'), { target: { value: 'Updated Recipe' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Changes')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe updated successfully')).toBeInTheDocument();
}, 10000);

test('fails to edit a recipe due to server error (from editRecipe_sortRecipesByRating)', async () => {
  fetchMock.put('/recipes/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Changes')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update recipe')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be sorted by rating - success (from editRecipe_sortRecipesByRating)', async () => {
  fetchMock.get('/api/recipes?sort=rating', { recipes: [{ id: 7, title: 'Top Rated Cake' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Rating')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Top Rated Cake')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be sorted by rating - failure (from editRecipe_sortRecipesByRating)', async () => {
  fetchMock.get('/api/recipes?sort=rating', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Rating')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

