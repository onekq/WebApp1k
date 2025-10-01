import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addRecipeToFavorites_listUsersRecipes_viewIngredientList';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds a recipe to favorites', async () => {
  fetchMock.post('/add-to-favorites', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('favorite-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe added to favorites')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to add a recipe to favorites', async () => {
  fetchMock.post('/add-to-favorites', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('favorite-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add to favorites')).toBeInTheDocument();
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

test('View Ingredient List successfully', async () => {
  fetchMock.get('/api/recipe/1/ingredients', { body: [{ name: 'Salt' }], status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Ingredients')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Salt')).toBeInTheDocument();
}, 10000);

test('View Ingredient List failure shows error message', async () => {
  fetchMock.get('/api/recipe/1/ingredients', { body: { message: 'Error fetching ingredients' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Ingredients')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching ingredients')).toBeInTheDocument();
}, 10000);
