import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addRecipe_deleteRecipeComment_filterRecipesByIngredient';

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

test('Successfully delete a recipe comment', async () => {
  fetchMock.delete('/api/delete-comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('delete-comment-message')).toBeInTheDocument();
}, 10000);

test('Fail to delete a recipe comment with error message', async () => {
  fetchMock.delete('/api/delete-comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by specific ingredients - success', async () => {
  fetchMock.get('/api/recipes?ingredient=tomato', { recipes: [{ id: 2, title: 'Tomato Pasta' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by ingredient...'), { target: { value: 'tomato' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tomato Pasta')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by specific ingredients - failure', async () => {
  fetchMock.get('/api/recipes?ingredient=tomato', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by ingredient...'), { target: { value: 'tomato' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);
