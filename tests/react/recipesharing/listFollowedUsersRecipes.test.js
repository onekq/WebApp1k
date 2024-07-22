import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './listFollowedUsersRecipes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Ensure users can view recipes added by users they follow - success', async () => {
  fetchMock.get('/api/recipes?followed=true', { recipes: [{ id: 10, title: 'Followed User Recipe' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Followed Users\' Recipes')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Followed User Recipe')).toBeInTheDocument();
}, 10000);

test('Ensure users can view recipes added by users they follow - failure', async () => {
  fetchMock.get('/api/recipes?followed=true', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Followed Users\' Recipes')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);