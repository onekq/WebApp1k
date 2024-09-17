import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sortRecipesByRating_uploadRecipeImage';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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