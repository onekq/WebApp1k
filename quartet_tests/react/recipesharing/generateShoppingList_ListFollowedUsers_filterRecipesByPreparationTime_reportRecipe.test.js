import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './generateShoppingList_ListFollowedUsers_filterRecipesByPreparationTime_reportRecipe';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Generate Shopping List successfully (from generateShoppingList_ListFollowedUsers)', async () => {
  fetchMock.post('/api/recipe/1/shopping-list', { body: { message: 'Shopping list generated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shopping list generated')).toBeInTheDocument();
}, 10000);

test('Generate Shopping List failure shows error message (from generateShoppingList_ListFollowedUsers)', async () => {
  fetchMock.post('/api/recipe/1/shopping-list', { body: { message: 'Error generating shopping list' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error generating shopping list')).toBeInTheDocument();
}, 10000);

test('successfully fetches list of followed users (from generateShoppingList_ListFollowedUsers)', async () => {
  fetchMock.get('/followed-users', { users: ['User 1', 'User 2'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('User 1')).toBeInTheDocument();
  expect(screen.getByText('User 2')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to fetch list of followed users (from generateShoppingList_ListFollowedUsers)', async () => {
  fetchMock.get('/followed-users', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch followed users')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by preparation time - success (from filterRecipesByPreparationTime_reportRecipe)', async () => {
  fetchMock.get('/api/recipes?prepTime=30', { recipes: [{ id: 4, title: 'Quick Salad' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by prep time...'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quick Salad')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by preparation time - failure (from filterRecipesByPreparationTime_reportRecipe)', async () => {
  fetchMock.get('/api/recipes?prepTime=30', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by prep time...'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('Report Recipe successfully (from filterRecipesByPreparationTime_reportRecipe)', async () => {
  fetchMock.post('/api/recipe/1/report', { body: { message: 'Recipe reported' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Report Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe reported')).toBeInTheDocument();
}, 10000);

test('Report Recipe failure shows error message (from filterRecipesByPreparationTime_reportRecipe)', async () => {
  fetchMock.post('/api/recipe/1/report', { body: { message: 'Error reporting recipe' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Report Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error reporting recipe')).toBeInTheDocument();
}, 10000);

