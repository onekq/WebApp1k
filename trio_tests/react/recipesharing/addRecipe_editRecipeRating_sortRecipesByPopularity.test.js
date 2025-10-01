import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addRecipe_editRecipeRating_sortRecipesByPopularity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds a recipe with all required fields', async () => {
  fetchMock.post('/recipes', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Recipe Name'), { target: { value: 'New Recipe' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe added successfully')).toBeInTheDocument();
}, 10000);

test('fails to add a recipe due to missing required fields', async () => {
  fetchMock.post('/recipes', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Add Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Please fill all required fields')).toBeInTheDocument();
}, 10000);

test('Successfully edit a recipe rating', async () => {
  fetchMock.put('/api/edit-rating', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rate-input'), { target: { value: '4' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-rate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('edit-rate-message')).toBeInTheDocument();
}, 10000);

test('Fail to edit recipe rating with error message', async () => {
  fetchMock.put('/api/edit-rating', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('rate-input'), { target: { value: '4' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-rate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be sorted by popularity - success', async () => {
  fetchMock.get('/api/recipes?sort=popularity', { recipes: [{ id: 9, title: 'Most Popular Dish' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Popularity')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Most Popular Dish')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be sorted by popularity - failure', async () => {
  fetchMock.get('/api/recipes?sort=popularity', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Popularity')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);
