import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import RemoveRecipeFromFavoritesComponent from './removeRecipeFromFavorites';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully removes a recipe from favorites', async () => {
  fetchMock.post('/remove-from-favorites', 200);

  await act(async () => { render(<MemoryRouter><RemoveRecipeFromFavoritesComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unfavorite-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe removed from favorites')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to remove a recipe from favorites', async () => {
  fetchMock.post('/remove-from-favorites', 500);

  await act(async () => { render(<MemoryRouter><RemoveRecipeFromFavoritesComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unfavorite-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove from favorites')).toBeInTheDocument();
}, 10000);

