import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterRecipesByDietaryPreferences_viewRecipeDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('View Recipe Details successfully', async () => {
  fetchMock.get('/api/recipe/1', { body: { title: 'Recipe Title' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe Title')).toBeInTheDocument();
}, 10000);

test('View Recipe Details failure shows error message', async () => {
  fetchMock.get('/api/recipe/1', { body: { message: 'Error fetching recipe' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching recipe')).toBeInTheDocument();
}, 10000);