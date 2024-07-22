import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecipe';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully deletes a recipe', async () => {
  fetchMock.delete('/recipes/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe deleted successfully')).toBeInTheDocument();
}, 10000);

test('fails to delete a recipe due to server error', async () => {
  fetchMock.delete('/recipes/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete recipe')).toBeInTheDocument();
}, 10000);

