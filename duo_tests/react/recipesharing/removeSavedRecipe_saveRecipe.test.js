import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removeSavedRecipe_saveRecipe';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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