import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './listSavedRecipes_saveShoppingList_ListFollowedUsers_searchByCookingTimeRange';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('successfully fetches list of followed users (from ListFollowedUsers_searchByCookingTimeRange)', async () => {
  fetchMock.get('/followed-users', { users: ['User 1', 'User 2'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('User 1')).toBeInTheDocument();
  expect(screen.getByText('User 2')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to fetch list of followed users (from ListFollowedUsers_searchByCookingTimeRange)', async () => {
  fetchMock.get('/followed-users', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch followed users')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be searched by a range of cooking times - success (from ListFollowedUsers_searchByCookingTimeRange)', async () => {
  fetchMock.get('/api/recipes?cookTime=10-30', { recipes: [{ id: 6, title: 'Quick Breakfast' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter cooking time range...'), { target: { value: '10-30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quick Breakfast')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be searched by a range of cooking times - failure (from ListFollowedUsers_searchByCookingTimeRange)', async () => {
  fetchMock.get('/api/recipes?cookTime=10-30', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter cooking time range...'), { target: { value: '10-30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

