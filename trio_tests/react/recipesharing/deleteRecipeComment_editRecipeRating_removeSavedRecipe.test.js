import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecipeComment_editRecipeRating_removeSavedRecipe';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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
