import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addRecipeToFavorites_editCookingTip_followUser_saveShoppingList';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a recipe to favorites (from addRecipeToFavorites_editCookingTip)', async () => {
  fetchMock.post('/add-to-favorites', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('favorite-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe added to favorites')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to add a recipe to favorites (from addRecipeToFavorites_editCookingTip)', async () => {
  fetchMock.post('/add-to-favorites', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('favorite-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add to favorites')).toBeInTheDocument();
}, 10000);

test('successfully edits cooking tips in a recipe (from addRecipeToFavorites_editCookingTip)', async () => {
  fetchMock.put('/recipes/1/tips/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Edit Tip'), { target: { value: 'Updated Tip' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Tip')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tip updated successfully')).toBeInTheDocument();
}, 10000);

test('fails to edit cooking tips due to server error (from addRecipeToFavorites_editCookingTip)', async () => {
  fetchMock.put('/recipes/1/tips/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Tip')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update tip')).toBeInTheDocument();
}, 10000);

test('Successfully follow another user (from followUser_saveShoppingList)', async () => {
  fetchMock.post('/api/follow-user', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('follow-message')).toBeInTheDocument();
}, 10000);

test('Fail to follow another user with error message (from followUser_saveShoppingList)', async () => {
  fetchMock.post('/api/follow-user', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Save Shopping List successfully (from followUser_saveShoppingList)', async () => {
  fetchMock.post('/api/shopping-list/save', { body: { message: 'Shopping list saved' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shopping list saved')).toBeInTheDocument();
}, 10000);

test('Save Shopping List failure shows error message (from followUser_saveShoppingList)', async () => {
  fetchMock.post('/api/shopping-list/save', { body: { message: 'Error saving shopping list' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error saving shopping list')).toBeInTheDocument();
}, 10000);

