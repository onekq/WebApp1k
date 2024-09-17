import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterRecipesByPreparationTime_removeSavedRecipe';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Ensure recipes can be filtered by preparation time - success', async () => {
  fetchMock.get('/api/recipes?prepTime=30', { recipes: [{ id: 4, title: 'Quick Salad' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by prep time...'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quick Salad')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by preparation time - failure', async () => {
  fetchMock.get('/api/recipes?prepTime=30', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by prep time...'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('successfully removes a saved recipe from user profile', async () => {
  fetchMock.post('/remove-saved-recipe', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe removed successfully')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to remove a saved recipe', async () => {
  fetchMock.post('/remove-saved-recipe', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove recipe')).toBeInTheDocument();
}, 10000);