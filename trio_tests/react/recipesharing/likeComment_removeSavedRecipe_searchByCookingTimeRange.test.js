import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './likeComment_removeSavedRecipe_searchByCookingTimeRange';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully like a comment on a recipe', async () => {
  fetchMock.post('/api/like-comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('like-comment-message')).toBeInTheDocument();
}, 10000);

test('Fail to like a comment with error message', async () => {
  fetchMock.post('/api/like-comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-comment-button')); });

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

test('Ensure recipes can be searched by a range of cooking times - success', async () => {
  fetchMock.get('/api/recipes?cookTime=10-30', { recipes: [{ id: 6, title: 'Quick Breakfast' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter cooking time range...'), { target: { value: '10-30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quick Breakfast')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be searched by a range of cooking times - failure', async () => {
  fetchMock.get('/api/recipes?cookTime=10-30', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter cooking time range...'), { target: { value: '10-30' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);
