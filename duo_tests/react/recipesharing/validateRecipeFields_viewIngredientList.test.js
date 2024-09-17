import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateRecipeFields_viewIngredientList';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully validates required fields for a recipe', async () => {
  fetchMock.post('/validate-recipe', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recipe-name-input'), { target: { value: 'Recipe 1' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Validation successful')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to validate required fields for a recipe', async () => {
  fetchMock.post('/validate-recipe', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recipe-name-input'), { target: { value: 'Recipe 1' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Validation failed')).toBeInTheDocument();
}, 10000);

test('View Ingredient List successfully', async () => {
  fetchMock.get('/api/recipe/1/ingredients', { body: [{ name: 'Salt' }], status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Ingredients')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Salt')).toBeInTheDocument();
}, 10000);

test('View Ingredient List failure shows error message', async () => {
  fetchMock.get('/api/recipe/1/ingredients', { body: { message: 'Error fetching ingredients' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Ingredients')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching ingredients')).toBeInTheDocument();
}, 10000);