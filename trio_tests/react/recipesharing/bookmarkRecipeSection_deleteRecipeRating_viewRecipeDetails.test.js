import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bookmarkRecipeSection_deleteRecipeRating_viewRecipeDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Bookmark Recipe Section successfully', async () => {
  fetchMock.post('/api/recipe/1/bookmark', { body: { message: 'Section bookmarked' }, status: 200 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Bookmark Section')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Section bookmarked')).toBeInTheDocument();
}, 10000);

test('Bookmark Recipe Section failure shows error message', async () => {
  fetchMock.post('/api/recipe/1/bookmark', { body: { message: 'Error bookmarking section' }, status: 500 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Bookmark Section')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error bookmarking section')).toBeInTheDocument();
}, 10000);

test('Successfully delete a recipe rating', async () => {
  fetchMock.delete('/api/delete-rating', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-rate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('delete-rate-message')).toBeInTheDocument();
}, 10000);

test('Fail to delete a recipe rating with error message', async () => {
  fetchMock.delete('/api/delete-rating', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-rate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('View Recipe Details successfully', async () => {
  fetchMock.get('/api/recipe/1', { body: { title: 'Recipe Title' }, status: 200 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe Title')).toBeInTheDocument();
}, 10000);

test('View Recipe Details failure shows error message', async () => {
  fetchMock.get('/api/recipe/1', { body: { message: 'Error fetching recipe' }, status: 500 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching recipe')).toBeInTheDocument();
}, 10000);
