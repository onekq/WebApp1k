import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './newReleases_reorderPlaylist';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('New releases are shown appropriately.', async () => {
  fetchMock.get('/songs/new', { songs: [{ id: 1, name: 'NewReleaseSong' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('New Releases')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('NewReleaseSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when new releases fail to load.', async () => {
  fetchMock.get('/songs/new', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('New Releases')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

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