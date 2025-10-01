import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './printRecipe_searchRecipes_sortRecipesByPopularity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('Ensure recipes can be searched by keyword - success', async () => {
  fetchMock.get('/api/recipes?search=chicken', { recipes: [{ id: 1, title: 'Chicken Soup' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'chicken' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Chicken Soup')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be searched by keyword - failure', async () => {
  fetchMock.get('/api/recipes?search=chicken', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'chicken' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
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
