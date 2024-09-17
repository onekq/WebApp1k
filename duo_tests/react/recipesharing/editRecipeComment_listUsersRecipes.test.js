import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editRecipeComment_listUsersRecipes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully edit a recipe comment', async () => {
  fetchMock.put('/api/edit-comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Delicious!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('edit-comment-message')).toBeInTheDocument();
}, 10000);

test('Fail to edit recipe comment with error message', async () => {
  fetchMock.put('/api/edit-comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Delicious!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('edit-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('successfully fetches user\'s added recipes', async () => {
  fetchMock.get('/user-recipes', { recipes: ['Recipe 1', 'Recipe 2'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe 1')).toBeInTheDocument();
  expect(screen.getByText('Recipe 2')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to fetch user\'s added recipes', async () => {
  fetchMock.get('/user-recipes', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);