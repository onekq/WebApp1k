import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './ListFollowedUsers_reportRecipe_viewCookingInstructions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully fetches list of followed users', async () => {
  fetchMock.get('/followed-users', { users: ['User 1', 'User 2'] });

  await act(async () => { render(<MemoryRouter><ListFollowedUsersComponent /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('User 1')).toBeInTheDocument();
  expect(screen.getByText('User 2')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to fetch list of followed users', async () => {
  fetchMock.get('/followed-users', 500);

  await act(async () => { render(<MemoryRouter><ListFollowedUsersComponent /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to fetch followed users')).toBeInTheDocument();
}, 10000);

test('Report Recipe successfully', async () => {
  fetchMock.post('/api/recipe/1/report', { body: { message: 'Recipe reported' }, status: 200 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Report Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe reported')).toBeInTheDocument();
}, 10000);

test('Report Recipe failure shows error message', async () => {
  fetchMock.post('/api/recipe/1/report', { body: { message: 'Error reporting recipe' }, status: 500 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Report Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error reporting recipe')).toBeInTheDocument();
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
