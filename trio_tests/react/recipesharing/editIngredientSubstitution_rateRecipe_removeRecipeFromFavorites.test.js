import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editIngredientSubstitution_rateRecipe_removeRecipeFromFavorites';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully edits ingredient substitutions in a recipe', async () => {
  fetchMock.put('/recipes/1/substitutions/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Edit Substitution'), { target: { value: 'Updated Ingredient' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Substitution')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Substitution updated')).toBeInTheDocument();
}, 10000);

test('fails to edit ingredient substitutions due to server error', async () => {
  fetchMock.put('/recipes/1/substitutions/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Substitution')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update substitution')).toBeInTheDocument();
}, 10000);

test('Successfully rate a recipe', async () => {
  fetchMock.post('/api/rate-recipe', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rate-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('rate-message')).toBeInTheDocument();
}, 10000);

test('Fail to rate a recipe with error message', async () => {
  fetchMock.post('/api/rate-recipe', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rate-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('successfully removes a recipe from favorites', async () => {
  fetchMock.post('/remove-from-favorites', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unfavorite-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe removed from favorites')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to remove a recipe from favorites', async () => {
  fetchMock.post('/remove-from-favorites', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unfavorite-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove from favorites')).toBeInTheDocument();
}, 10000);
