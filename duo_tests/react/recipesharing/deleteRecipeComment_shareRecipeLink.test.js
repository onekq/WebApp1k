import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecipeComment_shareRecipeLink';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully delete a recipe comment', async () => {
  fetchMock.delete('/api/delete-comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('delete-comment-message')).toBeInTheDocument();
}, 10000);

test('Fail to delete a recipe comment with error message', async () => {
  fetchMock.delete('/api/delete-comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Share Recipe Link successfully', async () => {
  fetchMock.post('/api/recipe/1/share', { body: { message: 'Recipe link shared' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Recipe Link')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe link shared')).toBeInTheDocument();
}, 10000);

test('Share Recipe Link failure shows error message', async () => {
  fetchMock.post('/api/recipe/1/share', { body: { message: 'Error sharing recipe link' }, status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Share Recipe Link')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error sharing recipe link')).toBeInTheDocument();
}, 10000);