import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './browseGenres';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully browses genres and gets results', async () => {
  fetchMock.get('/api/genres', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('browse-genres')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('genre-list')).toBeInTheDocument();
}, 10000);

test('fails to browse genres due to server error', async () => {
  fetchMock.get('/api/genres', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('browse-genres')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load genres. Please try again.')).toBeInTheDocument();
}, 10000);

