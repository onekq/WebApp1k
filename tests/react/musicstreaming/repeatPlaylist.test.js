import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './repeatPlaylist';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Repeat Playlist - success shows repeat playlist mode activated message', async () => {
  fetchMock.post('/api/repeat-playlist', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Repeat Playlist')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Repeat playlist mode activated')).toBeInTheDocument();
}, 10000);

test('Repeat Playlist - failure shows error message', async () => {
  fetchMock.post('/api/repeat-playlist', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Repeat Playlist')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to activate repeat playlist mode')).toBeInTheDocument();
}, 10000);

