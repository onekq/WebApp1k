import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sortRecipesByMostRecent';

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

