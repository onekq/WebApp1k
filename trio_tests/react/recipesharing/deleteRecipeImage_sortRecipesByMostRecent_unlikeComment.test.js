import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecipeImage_sortRecipesByMostRecent_unlikeComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully deletes an image from a recipe', async () => {
  fetchMock.delete('/recipes/1/image', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Image')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Image deleted successfully')).toBeInTheDocument();
}, 10000);

test('fails to delete an image from a recipe due to server error', async () => {
  fetchMock.delete('/recipes/1/image', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Image')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete image')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be sorted by most recent - success', async () => {
  fetchMock.get('/api/recipes?sort=recent', { recipes: [{ id: 8, title: 'Newest Recipe' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Most Recent')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Newest Recipe')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be sorted by most recent - failure', async () => {
  fetchMock.get('/api/recipes?sort=recent', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Most Recent')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('Successfully unlike a comment on a recipe', async () => {
  fetchMock.post('/api/unlike-comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('unlike-comment-message')).toBeInTheDocument();
}, 10000);

test('Fail to unlike a comment with error message', async () => {
  fetchMock.post('/api/unlike-comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
