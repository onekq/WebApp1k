import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './ListFollowedUsers_filterRecipesByDietaryPreferences_reportRecipe';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully fetches list of followed users', async () => {
  fetchMock.get('/followed-users', { users: ['User 1', 'User 2'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('User 1')).toBeInTheDocument();
  expect(screen.getByText('User 2')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to fetch list of followed users', async () => {
  fetchMock.get('/followed-users', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch followed users')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by dietary preferences - success', async () => {
  fetchMock.get('/api/recipes?diet=vegan', { recipes: [{ id: 5, title: 'Vegan Smoothie' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by diet...'), { target: { value: 'vegan' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Vegan Smoothie')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by dietary preferences - failure', async () => {
  fetchMock.get('/api/recipes?diet=vegan', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by diet...'), { target: { value: 'vegan' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('Report Recipe successfully', async () => {
  fetchMock.post('/api/recipe/1/report', { body: { message: 'Recipe reported' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Report Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe reported')).toBeInTheDocument();
}, 10000);

test('Report Recipe failure shows error message', async () => {
  fetchMock.post('/api/recipe/1/report', { body: { message: 'Error reporting recipe' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Report Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error reporting recipe')).toBeInTheDocument();
}, 10000);
