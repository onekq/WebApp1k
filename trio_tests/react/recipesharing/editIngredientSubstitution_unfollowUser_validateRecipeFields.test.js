import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editIngredientSubstitution_unfollowUser_validateRecipeFields';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully edits ingredient substitutions in a recipe', async () => {
  fetchMock.put('/recipes/1/substitutions/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Edit Substitution'), { target: { value: 'Updated Ingredient' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Substitution')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Substitution updated')).toBeInTheDocument();
}, 10000);

test('fails to edit ingredient substitutions due to server error', async () => {
  fetchMock.put('/recipes/1/substitutions/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Save Substitution')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update substitution')).toBeInTheDocument();
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

test('successfully validates required fields for a recipe', async () => {
  fetchMock.post('/validate-recipe', 200);

  await act(async () => { render(<MemoryRouter><ValidateRecipeFieldsComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recipe-name-input'), { target: { value: 'Recipe 1' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Validation successful')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to validate required fields for a recipe', async () => {
  fetchMock.post('/validate-recipe', 500);

  await act(async () => { render(<MemoryRouter><ValidateRecipeFieldsComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recipe-name-input'), { target: { value: 'Recipe 1' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Validation failed')).toBeInTheDocument();
}, 10000);
