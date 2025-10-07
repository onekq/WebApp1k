import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './CalculateRecipeRatings_deleteRecipeComment_validateRecipeFields_viewIngredientList';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully calculates the average rating of a recipe (from CalculateRecipeRatings_deleteRecipeComment)', async () => {
  fetchMock.get('/recipe-rating', { rating: 4.5 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Average rating: 4.5')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to calculate the average rating of a recipe (from CalculateRecipeRatings_deleteRecipeComment)', async () => {
  fetchMock.get('/recipe-rating', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to calculate rating')).toBeInTheDocument();
}, 10000);

test('Successfully delete a recipe comment (from CalculateRecipeRatings_deleteRecipeComment)', async () => {
  fetchMock.delete('/api/delete-comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('delete-comment-message')).toBeInTheDocument();
}, 10000);

test('Fail to delete a recipe comment with error message (from CalculateRecipeRatings_deleteRecipeComment)', async () => {
  fetchMock.delete('/api/delete-comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

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

