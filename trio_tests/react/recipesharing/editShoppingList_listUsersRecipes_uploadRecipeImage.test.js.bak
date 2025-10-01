import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editShoppingList_listUsersRecipes_uploadRecipeImage';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Edit Shopping List successfully', async () => {
  fetchMock.put('/api/shopping-list/1', { body: { message: 'Shopping list updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Edit Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shopping list updated')).toBeInTheDocument();
}, 10000);

test('Edit Shopping List failure shows error message', async () => {
  fetchMock.put('/api/shopping-list/1', { body: { message: 'Error updating shopping list' }, status: 500 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Edit Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error updating shopping list')).toBeInTheDocument();
}, 10000);

test('successfully fetches user\'s added recipes', async () => {
  fetchMock.get('/user-recipes', { recipes: ['Recipe 1', 'Recipe 2'] });

  await act(async () => { render(<MemoryRouter><ListUsersRecipesComponent /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe 1')).toBeInTheDocument();
  expect(screen.getByText('Recipe 2')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to fetch user\'s added recipes', async () => {
  fetchMock.get('/user-recipes', 500);

  await act(async () => { render(<MemoryRouter><ListUsersRecipesComponent /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('successfully uploads an image for a recipe', async () => {
  fetchMock.post('/recipes/1/image', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Image Upload'), { target: { value: 'image-file.jpg' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Upload Image')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Image uploaded successfully')).toBeInTheDocument();
}, 10000);

test('fails to upload an image for a recipe due to invalid file type', async () => {
  fetchMock.post('/recipes/1/image', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Upload Image')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid file type')).toBeInTheDocument();
}, 10000);
