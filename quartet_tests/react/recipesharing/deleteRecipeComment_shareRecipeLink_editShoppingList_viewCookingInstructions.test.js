import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecipeComment_shareRecipeLink_editShoppingList_viewCookingInstructions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully delete a recipe comment (from deleteRecipeComment_shareRecipeLink)', async () => {
  fetchMock.delete('/api/delete-comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('delete-comment-message')).toBeInTheDocument();
}, 10000);

test('Fail to delete a recipe comment with error message (from deleteRecipeComment_shareRecipeLink)', async () => {
  fetchMock.delete('/api/delete-comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Share Recipe Link successfully (from deleteRecipeComment_shareRecipeLink)', async () => {
  fetchMock.post('/api/recipe/1/share', { body: { message: 'Recipe link shared' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Recipe Link')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe link shared')).toBeInTheDocument();
}, 10000);

test('Share Recipe Link failure shows error message (from deleteRecipeComment_shareRecipeLink)', async () => {
  fetchMock.post('/api/recipe/1/share', { body: { message: 'Error sharing recipe link' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Recipe Link')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error sharing recipe link')).toBeInTheDocument();
}, 10000);

test('Edit Shopping List successfully (from editShoppingList_viewCookingInstructions)', async () => {
  fetchMock.put('/api/shopping-list/1', { body: { message: 'Shopping list updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Edit Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shopping list updated')).toBeInTheDocument();
}, 10000);

test('Edit Shopping List failure shows error message (from editShoppingList_viewCookingInstructions)', async () => {
  fetchMock.put('/api/shopping-list/1', { body: { message: 'Error updating shopping list' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Edit Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error updating shopping list')).toBeInTheDocument();
}, 10000);

test('View Cooking Instructions successfully (from editShoppingList_viewCookingInstructions)', async () => {
  fetchMock.get('/api/recipe/1/instructions', { body: [{ step: 'Preheat oven to 350F' }], status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Instructions')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Preheat oven to 350F')).toBeInTheDocument();
}, 10000);

test('View Cooking Instructions failure shows error message (from editShoppingList_viewCookingInstructions)', async () => {
  fetchMock.get('/api/recipe/1/instructions', { body: { message: 'Error fetching instructions' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Instructions')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching instructions')).toBeInTheDocument();
}, 10000);

