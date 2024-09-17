import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecipeRating_saveRecipe';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully delete a recipe rating', async () => {
  fetchMock.delete('/api/delete-rating', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-rate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('delete-rate-message')).toBeInTheDocument();
}, 10000);

test('Fail to delete a recipe rating with error message', async () => {
  fetchMock.delete('/api/delete-rating', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-rate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('successfully saves a recipe to user profile', async () => {
  fetchMock.post('/save-recipe', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recipe-input'), { target: { value: 'Recipe 1' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe saved successfully')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to save a recipe', async () => {
  fetchMock.post('/save-recipe', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recipe-input'), { target: { value: 'Recipe 1' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save recipe')).toBeInTheDocument();
}, 10000);