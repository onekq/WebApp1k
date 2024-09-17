import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './reorderPlaylist_shufflePlay';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully reorders songs in a playlist', async () => {
  fetchMock.put('/api/playlists/1/reorder', 200);

  await act(async () => { render(<MemoryRouter><App playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.dragAndDrop(screen.getByTestId('song-1'), screen.getByTestId('song-2')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playlist reordered successfully')).toBeInTheDocument();
}, 10000);

test('fails to reorder songs in a non-existing playlist', async () => {
  fetchMock.put('/api/playlists/1/reorder', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.dragAndDrop(screen.getByTestId('song-1'), screen.getByTestId('song-2')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to reorder playlist: Playlist not found')).toBeInTheDocument();
}, 10000);

test('Shuffle Play - success shows shuffle mode activated message', async () => {
  fetchMock.post('/api/shuffle-play', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Shuffle Play')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shuffle mode activated')).toBeInTheDocument();
}, 10000);

test('Shuffle Play - failure shows error message', async () => {
  fetchMock.post('/api/shuffle-play', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Shuffle Play')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to activate shuffle mode')).toBeInTheDocument();
}, 10000);