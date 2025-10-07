import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './CalculateRecipeRatings_shareRecipeLink_addRecipe_sortRecipesByMostRecent';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully calculates the average rating of a recipe (from CalculateRecipeRatings_shareRecipeLink)', async () => {
  fetchMock.get('/recipe-rating', { rating: 4.5 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Average rating: 4.5')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to calculate the average rating of a recipe (from CalculateRecipeRatings_shareRecipeLink)', async () => {
  fetchMock.get('/recipe-rating', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to calculate rating')).toBeInTheDocument();
}, 10000);

test('Share Recipe Link successfully (from CalculateRecipeRatings_shareRecipeLink)', async () => {
  fetchMock.post('/api/recipe/1/share', { body: { message: 'Recipe link shared' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Recipe Link')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe link shared')).toBeInTheDocument();
}, 10000);

test('Share Recipe Link failure shows error message (from CalculateRecipeRatings_shareRecipeLink)', async () => {
  fetchMock.post('/api/recipe/1/share', { body: { message: 'Error sharing recipe link' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Recipe Link')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error sharing recipe link')).toBeInTheDocument();
}, 10000);

test('successfully adds a recipe with all required fields (from addRecipe_sortRecipesByMostRecent)', async () => {
  fetchMock.post('/recipes', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Recipe Name'), { target: { value: 'New Recipe' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe added successfully')).toBeInTheDocument();
}, 10000);

test('fails to add a recipe due to missing required fields (from addRecipe_sortRecipesByMostRecent)', async () => {
  fetchMock.post('/recipes', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Please fill all required fields')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be sorted by most recent - success (from addRecipe_sortRecipesByMostRecent)', async () => {
  fetchMock.get('/api/recipes?sort=recent', { recipes: [{ id: 8, title: 'Newest Recipe' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Most Recent')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Newest Recipe')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be sorted by most recent - failure (from addRecipe_sortRecipesByMostRecent)', async () => {
  fetchMock.get('/api/recipes?sort=recent', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Most Recent')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

