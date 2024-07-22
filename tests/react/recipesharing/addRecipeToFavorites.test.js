import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import AddRecipeToFavoritesComponent from './addRecipeToFavorites';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a recipe to favorites', async () => {
  fetchMock.post('/add-to-favorites', 200);

  await act(async () => { render(<MemoryRouter><AddRecipeToFavoritesComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('favorite-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe added to favorites')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to add a recipe to favorites', async () => {
  fetchMock.post('/add-to-favorites', 500);

  await act(async () => { render(<MemoryRouter><AddRecipeToFavoritesComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('favorite-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add to favorites')).toBeInTheDocument();
}, 10000);
