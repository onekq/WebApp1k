import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addRecipe_editRecipe_sortRecipesByMostRecent_viewRecipeDetails';

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

test('Ensure recipes can be sorted by most recent - success (from sortRecipesByMostRecent_viewRecipeDetails)', async () => {
  fetchMock.get('/api/recipes?sort=recent', { recipes: [{ id: 8, title: 'Newest Recipe' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Most Recent')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Newest Recipe')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be sorted by most recent - failure (from sortRecipesByMostRecent_viewRecipeDetails)', async () => {
  fetchMock.get('/api/recipes?sort=recent', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Most Recent')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('View Recipe Details successfully (from sortRecipesByMostRecent_viewRecipeDetails)', async () => {
  fetchMock.get('/api/recipe/1', { body: { title: 'Recipe Title' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe Title')).toBeInTheDocument();
}, 10000);

test('View Recipe Details failure shows error message (from sortRecipesByMostRecent_viewRecipeDetails)', async () => {
  fetchMock.get('/api/recipe/1', { body: { message: 'Error fetching recipe' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching recipe')).toBeInTheDocument();
}, 10000);

