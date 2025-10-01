import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addIngredientSubstitution_filterRecipesByDietaryPreferences_unfollowUser';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds ingredient substitutions to a recipe', async () => {
  fetchMock.post('/recipes/1/substitutions', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Substitution'), { target: { value: 'New Ingredient' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Substitution')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Ingredient substitution added')).toBeInTheDocument();
}, 10000);

test('fails to add ingredient substitutions due to invalid input', async () => {
  fetchMock.post('/recipes/1/substitutions', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add Substitution')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid substitution')).toBeInTheDocument();
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

test('Successfully unfollow another user', async () => {
  fetchMock.post('/api/unfollow-user', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unfollow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('unfollow-message')).toBeInTheDocument();
}, 10000);

test('Fail to unfollow another user with error message', async () => {
  fetchMock.post('/api/unfollow-user', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unfollow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
