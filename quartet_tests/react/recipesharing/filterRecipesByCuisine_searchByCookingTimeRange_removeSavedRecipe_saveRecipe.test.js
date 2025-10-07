import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterRecipesByCuisine_searchByCookingTimeRange_removeSavedRecipe_saveRecipe';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Ensure recipes can be filtered by cuisine type - success (from filterRecipesByCuisine_searchByCookingTimeRange)', async () => {
  fetchMock.get('/api/recipes?cuisine=italian', { recipes: [{ id: 3, title: 'Italian Pizza' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by cuisine...'), { target: { value: 'italian' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Italian Pizza')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by cuisine type - failure (from filterRecipesByCuisine_searchByCookingTimeRange)', async () => {
  fetchMock.get('/api/recipes?cuisine=italian', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by cuisine...'), { target: { value: 'italian' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be searched by a range of cooking times - success (from filterRecipesByCuisine_searchByCookingTimeRange)', async () => {
  fetchMock.get('/api/recipes?cookTime=10-30', { recipes: [{ id: 6, title: 'Quick Breakfast' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter cooking time range...'), { target: { value: '10-30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quick Breakfast')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be searched by a range of cooking times - failure (from filterRecipesByCuisine_searchByCookingTimeRange)', async () => {
  fetchMock.get('/api/recipes?cookTime=10-30', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter cooking time range...'), { target: { value: '10-30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('successfully removes a saved recipe from user profile (from removeSavedRecipe_saveRecipe)', async () => {
  fetchMock.post('/remove-saved-recipe', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe removed successfully')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to remove a saved recipe (from removeSavedRecipe_saveRecipe)', async () => {
  fetchMock.post('/remove-saved-recipe', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove recipe')).toBeInTheDocument();
}, 10000);

test('successfully saves a recipe to user profile (from removeSavedRecipe_saveRecipe)', async () => {
  fetchMock.post('/save-recipe', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recipe-input'), { target: { value: 'Recipe 1' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe saved successfully')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to save a recipe (from removeSavedRecipe_saveRecipe)', async () => {
  fetchMock.post('/save-recipe', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recipe-input'), { target: { value: 'Recipe 1' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save recipe')).toBeInTheDocument();
}, 10000);

