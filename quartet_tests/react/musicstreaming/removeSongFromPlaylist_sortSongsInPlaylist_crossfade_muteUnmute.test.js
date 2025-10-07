import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removeSongFromPlaylist_sortSongsInPlaylist_crossfade_muteUnmute';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully removes a song from a playlist (from removeSongFromPlaylist_sortSongsInPlaylist)', async () => {
  fetchMock.delete('/api/playlists/1/songs/1', 200);

  await act(async () => { render(<MemoryRouter><App playlistId={1} songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Song removed from playlist')).toBeInTheDocument();
}, 10000);

test('fails to remove a non-existing song from the playlist (from removeSongFromPlaylist_sortSongsInPlaylist)', async () => {
  fetchMock.delete('/api/playlists/1/songs/1', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove song: Song not found')).toBeInTheDocument();
}, 10000);

test('successfully sorts songs within a playlist by name (from removeSongFromPlaylist_sortSongsInPlaylist)', async () => {
  fetchMock.get('/api/playlists/1/songs?sort=name', [{ id: 1, name: 'A Song' }, { id: 2, name: 'B Song' }]);

  await act(async () => { render(<MemoryRouter><App playlistId={1} sortBy="name" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-songs-by-name-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Songs sorted by name within playlist')).toBeInTheDocument();
}, 10000);

test('fails to sort songs within a playlist due to empty playlist (from removeSongFromPlaylist_sortSongsInPlaylist)', async () => {
  fetchMock.get('/api/playlists/1/songs?sort=name', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} sortBy="name" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-songs-by-name-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort songs: No songs found')).toBeInTheDocument();
}, 10000);

test('Crossfade - success shows crossfade activated message (from crossfade_muteUnmute)', async () => {
  fetchMock.post('/api/crossfade', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Crossfade')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Crossfade activated')).toBeInTheDocument();
}, 10000);

test('Crossfade - failure shows error message (from crossfade_muteUnmute)', async () => {
  fetchMock.post('/api/crossfade', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Crossfade')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to activate crossfade')).toBeInTheDocument();
}, 10000);

test('Mute/Unmute - success shows mute/unmute toggled message (from crossfade_muteUnmute)', async () => {
  fetchMock.post('/api/toggle-mute', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Mute/Unmute')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Mute/Unmute toggled')).toBeInTheDocument();
}, 10000);

test('Mute/Unmute - failure shows error message (from crossfade_muteUnmute)', async () => {
  fetchMock.post('/api/toggle-mute', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Mute/Unmute')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to toggle mute/unmute')).toBeInTheDocument();
}, 10000);

