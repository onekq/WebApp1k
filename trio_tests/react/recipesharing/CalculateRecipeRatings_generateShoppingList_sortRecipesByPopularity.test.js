import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './CalculateRecipeRatings_generateShoppingList_sortRecipesByPopularity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully calculates the average rating of a recipe', async () => {
  fetchMock.get('/recipe-rating', { rating: 4.5 });

  await act(async () => { render(<MemoryRouter><CalculateRecipeRatingsComponent /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Average rating: 4.5')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to calculate the average rating of a recipe', async () => {
  fetchMock.get('/recipe-rating', 500);

  await act(async () => { render(<MemoryRouter><CalculateRecipeRatingsComponent /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to calculate rating')).toBeInTheDocument();
}, 10000);

test('Generate Shopping List successfully', async () => {
  fetchMock.post('/api/recipe/1/shopping-list', { body: { message: 'Shopping list generated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shopping list generated')).toBeInTheDocument();
}, 10000);

test('Generate Shopping List failure shows error message', async () => {
  fetchMock.post('/api/recipe/1/shopping-list', { body: { message: 'Error generating shopping list' }, status: 500 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Shopping List')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error generating shopping list')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be sorted by popularity - success', async () => {
  fetchMock.get('/api/recipes?sort=popularity', { recipes: [{ id: 9, title: 'Most Popular Dish' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Popularity')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Most Popular Dish')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be sorted by popularity - failure', async () => {
  fetchMock.get('/api/recipes?sort=popularity', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Popularity')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);
