import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editRecipeComment_likeComment_viewRecipeDetails';

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
