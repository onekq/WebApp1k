import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './reportComment_shareRecipeLink_CalculateRecipeRatings_removeSavedRecipe';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully reports a comment (from reportComment_shareRecipeLink)', async () => {
  fetchMock.post('/report-comment', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment reported')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to report a comment (from reportComment_shareRecipeLink)', async () => {
  fetchMock.post('/report-comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to report comment')).toBeInTheDocument();
}, 10000);

test('Share Recipe Link successfully (from reportComment_shareRecipeLink)', async () => {
  fetchMock.post('/api/recipe/1/share', { body: { message: 'Recipe link shared' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Recipe Link')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe link shared')).toBeInTheDocument();
}, 10000);

test('Share Recipe Link failure shows error message (from reportComment_shareRecipeLink)', async () => {
  fetchMock.post('/api/recipe/1/share', { body: { message: 'Error sharing recipe link' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Recipe Link')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error sharing recipe link')).toBeInTheDocument();
}, 10000);

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

