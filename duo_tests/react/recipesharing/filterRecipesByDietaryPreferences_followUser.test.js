import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterRecipesByDietaryPreferences_followUser';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Ensure recipes can be filtered by dietary preferences - success', async () => {
  fetchMock.get('/api/recipes?diet=vegan', { recipes: [{ id: 5, title: 'Vegan Smoothie' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by diet...'), { target: { value: 'vegan' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Vegan Smoothie')).toBeInTheDocument();
}, 10000);

test('Ensure recipes can be filtered by dietary preferences - failure', async () => {
  fetchMock.get('/api/recipes?diet=vegan', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Filter by diet...'), { target: { value: 'vegan' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch recipes')).toBeInTheDocument();
}, 10000);

test('Successfully follow another user', async () => {
  fetchMock.post('/api/follow-user', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('follow-message')).toBeInTheDocument();
}, 10000);

test('Fail to follow another user with error message', async () => {
  fetchMock.post('/api/follow-user', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('follow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);