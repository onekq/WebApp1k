import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addRecipe_editRecipe_filterRecipesByCuisine_filterRecipesByIngredient';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a recipe with all required fields (from addRecipe_editRecipe)', async () => {
  fetchMock.post('/recipes', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Recipe Name'), { target: { value: 'New Recipe' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe added successfully')).toBeInTheDocument();
}, 10000);

test('fails to add a recipe due to missing required fields (from addRecipe_editRecipe)', async () => {
  fetchMock.post('/recipes', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Please fill all required fields')).toBeInTheDocument();
}, 10000);

test('successfully edits an existing recipe (from addRecipe_editRecipe)', async () => {
  fetchMock.put('/recipes/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Recipe Name'), { target: { value: 'Updated Recipe' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Changes')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe updated successfully')).toBeInTheDocument();
}, 10000);

test('fails to edit a recipe due to server error (from addRecipe_editRecipe)', async () => {
  fetchMock.put('/recipes/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Changes')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update recipe')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by cuisine type - success (from filterRecipesByCuisine_filterRecipesByIngredient)', async () => {
  fetchMock.get('/api/recipes?cuisine=italian', { recipes: [{ id: 3, title: 'Italian Pizza' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by cuisine...'), { target: { value: 'italian' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Italian Pizza')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by cuisine type - failure (from filterRecipesByCuisine_filterRecipesByIngredient)', async () => {
  fetchMock.get('/api/recipes?cuisine=italian', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by cuisine...'), { target: { value: 'italian' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by specific ingredients - success (from filterRecipesByCuisine_filterRecipesByIngredient)', async () => {
  fetchMock.get('/api/recipes?ingredient=tomato', { recipes: [{ id: 2, title: 'Tomato Pasta' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by ingredient...'), { target: { value: 'tomato' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tomato Pasta')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by specific ingredients - failure (from filterRecipesByCuisine_filterRecipesByIngredient)', async () => {
  fetchMock.get('/api/recipes?ingredient=tomato', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by ingredient...'), { target: { value: 'tomato' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

