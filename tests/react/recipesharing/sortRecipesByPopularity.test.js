import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sortRecipesByPopularity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

