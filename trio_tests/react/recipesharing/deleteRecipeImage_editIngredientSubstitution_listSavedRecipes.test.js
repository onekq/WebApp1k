import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecipeImage_editIngredientSubstitution_listSavedRecipes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully deletes an image from a recipe', async () => {
  fetchMock.delete('/recipes/1/image', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Image')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Image deleted successfully')).toBeInTheDocument();
}, 10000);

test('fails to delete an image from a recipe due to server error', async () => {
  fetchMock.delete('/recipes/1/image', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Image')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete image')).toBeInTheDocument();
}, 10000);

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

test('successfully fetches user\'s saved recipes', async () => {
  fetchMock.get('/saved-recipes', { recipes: ['Recipe 1', 'Recipe 2'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe 1')).toBeInTheDocument();
  expect(screen.getByText('Recipe 2')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to fetch user\'s saved recipes', async () => {
  fetchMock.get('/saved-recipes', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch saved recipes')).toBeInTheDocument();
}, 10000);
