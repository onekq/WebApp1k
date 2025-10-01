import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sortRecipesByMostRecent_sortRecipesByRating_viewCookingInstructions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('View Cooking Instructions successfully', async () => {
  fetchMock.get('/api/recipe/1/instructions', { body: [{ step: 'Preheat oven to 350F' }], status: 200 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Instructions')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Preheat oven to 350F')).toBeInTheDocument();
}, 10000);

test('View Cooking Instructions failure shows error message', async () => {
  fetchMock.get('/api/recipe/1/instructions', { body: { message: 'Error fetching instructions' }, status: 500 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Instructions')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching instructions')).toBeInTheDocument();
}, 10000);
