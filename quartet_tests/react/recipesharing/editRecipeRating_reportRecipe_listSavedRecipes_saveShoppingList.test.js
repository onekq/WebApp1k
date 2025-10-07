import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editRecipeRating_reportRecipe_listSavedRecipes_saveShoppingList';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully edit a recipe rating (from editRecipeRating_reportRecipe)', async () => {
  fetchMock.put('/api/edit-rating', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rate-input'), { target: { value: '4' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-rate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('edit-rate-message')).toBeInTheDocument();
}, 10000);

test('Fail to edit recipe rating with error message (from editRecipeRating_reportRecipe)', async () => {
  fetchMock.put('/api/edit-rating', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rate-input'), { target: { value: '4' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-rate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Report Recipe successfully (from editRecipeRating_reportRecipe)', async () => {
  fetchMock.post('/api/recipe/1/report', { body: { message: 'Recipe reported' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Report Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe reported')).toBeInTheDocument();
}, 10000);

test('Report Recipe failure shows error message (from editRecipeRating_reportRecipe)', async () => {
  fetchMock.post('/api/recipe/1/report', { body: { message: 'Error reporting recipe' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Report Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error reporting recipe')).toBeInTheDocument();
}, 10000);

test('Save Shopping List successfully (from listSavedRecipes_saveShoppingList)', async () => {
  fetchMock.post('/api/shopping-list/save', { body: { message: 'Shopping list saved' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shopping list saved')).toBeInTheDocument();
}, 10000);

test('Save Shopping List failure shows error message (from listSavedRecipes_saveShoppingList)', async () => {
  fetchMock.post('/api/shopping-list/save', { body: { message: 'Error saving shopping list' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error saving shopping list')).toBeInTheDocument();
}, 10000);

