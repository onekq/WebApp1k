import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecipeImage';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully deletes an image from a recipe', async () => {
  fetchMock.delete('/recipes/1/image', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Image')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Image deleted successfully')).toBeInTheDocument();
}, 10000);

test('fails to delete an image from a recipe due to server error', async () => {
  fetchMock.delete('/recipes/1/image', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Image')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete image')).toBeInTheDocument();
}, 10000);

