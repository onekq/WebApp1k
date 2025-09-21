import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deletePlaylist_reorderPlaylist_repeatPlaylist';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully deletes a playlist', async () => {
  fetchMock.delete('/api/playlists/1', 200);

  await act(async () => { render(<MemoryRouter><DeletePlaylist playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playlist deleted successfully')).toBeInTheDocument();
}, 10000);

test('fails to delete a non-existing playlist', async () => {
  fetchMock.delete('/api/playlists/1', 404);

  await act(async () => { render(<MemoryRouter><DeletePlaylist playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete playlist: Playlist not found')).toBeInTheDocument();
}, 10000);

test('successfully reorders songs in a playlist', async () => {
  fetchMock.put('/api/playlists/1/reorder', 200);

  await act(async () => { render(<MemoryRouter><ReorderPlaylist playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.dragAndDrop(screen.getByTestId('song-1'), screen.getByTestId('song-2')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playlist reordered successfully')).toBeInTheDocument();
}, 10000);

test('fails to reorder songs in a non-existing playlist', async () => {
  fetchMock.put('/api/playlists/1/reorder', 404);

  await act(async () => { render(<MemoryRouter><ReorderPlaylist playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.dragAndDrop(screen.getByTestId('song-1'), screen.getByTestId('song-2')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to reorder playlist: Playlist not found')).toBeInTheDocument();
}, 10000);

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
