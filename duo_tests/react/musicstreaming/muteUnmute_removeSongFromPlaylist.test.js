import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './muteUnmute_removeSongFromPlaylist';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Mute/Unmute - success shows mute/unmute toggled message', async () => {
  fetchMock.post('/api/toggle-mute', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Mute/Unmute')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Mute/Unmute toggled')).toBeInTheDocument();
}, 10000);

test('Mute/Unmute - failure shows error message', async () => {
  fetchMock.post('/api/toggle-mute', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Mute/Unmute')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to toggle mute/unmute')).toBeInTheDocument();
}, 10000);

test('successfully removes a song from a playlist', async () => {
  fetchMock.delete('/api/playlists/1/songs/1', 200);

  await act(async () => { render(<MemoryRouter><App playlistId={1} songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Song removed from playlist')).toBeInTheDocument();
}, 10000);

test('fails to remove a non-existing song from the playlist', async () => {
  fetchMock.delete('/api/playlists/1/songs/1', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove song: Song not found')).toBeInTheDocument();
}, 10000);