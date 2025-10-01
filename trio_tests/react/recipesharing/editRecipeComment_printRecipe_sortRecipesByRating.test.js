import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editRecipeComment_printRecipe_sortRecipesByRating';

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

test('Print Recipe successfully', async () => {
  fetchMock.get('/api/recipe/1', { body: { title: 'Printable Recipe' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Print Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Printable Recipe')).toBeInTheDocument();
}, 10000);

test('Print Recipe failure shows error message', async () => {
  fetchMock.get('/api/recipe/1', { body: { message: 'Error printing recipe' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Print Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error printing recipe')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be sorted by rating - success', async () => {
  fetchMock.get('/api/recipes?sort=rating', { recipes: [{ id: 7, title: 'Top Rated Cake' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Rating')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Top Rated Cake')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be sorted by rating - failure', async () => {
  fetchMock.get('/api/recipes?sort=rating', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Rating')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);
