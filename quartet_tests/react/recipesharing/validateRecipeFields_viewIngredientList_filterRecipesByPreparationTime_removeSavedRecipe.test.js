import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateRecipeFields_viewIngredientList_filterRecipesByPreparationTime_removeSavedRecipe';

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

test('Ensure recipes can be filtered by preparation time - success (from filterRecipesByPreparationTime_removeSavedRecipe)', async () => {
  fetchMock.get('/api/recipes?prepTime=30', { recipes: [{ id: 4, title: 'Quick Salad' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by prep time...'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quick Salad')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by preparation time - failure (from filterRecipesByPreparationTime_removeSavedRecipe)', async () => {
  fetchMock.get('/api/recipes?prepTime=30', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by prep time...'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('successfully removes a saved recipe from user profile (from filterRecipesByPreparationTime_removeSavedRecipe)', async () => {
  fetchMock.post('/remove-saved-recipe', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe removed successfully')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to remove a saved recipe (from filterRecipesByPreparationTime_removeSavedRecipe)', async () => {
  fetchMock.post('/remove-saved-recipe', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove recipe')).toBeInTheDocument();
}, 10000);

