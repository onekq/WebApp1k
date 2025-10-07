import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './muteUnmute_playPlaylist_playbackSpeedControl_removeSongFromPlaylist';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Mute/Unmute - success shows mute/unmute toggled message (from muteUnmute_playPlaylist)', async () => {
  fetchMock.post('/api/toggle-mute', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Mute/Unmute')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Mute/Unmute toggled')).toBeInTheDocument();
}, 10000);

test('Mute/Unmute - failure shows error message (from muteUnmute_playPlaylist)', async () => {
  fetchMock.post('/api/toggle-mute', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Mute/Unmute')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to toggle mute/unmute')).toBeInTheDocument();
}, 10000);

test('successfully plays a playlist (from muteUnmute_playPlaylist)', async () => {
  fetchMock.post('/api/playlists/1/play', 200);

  await act(async () => { render(<MemoryRouter><App playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playing playlist')).toBeInTheDocument();
}, 10000);

test('fails to play a non-existing playlist (from muteUnmute_playPlaylist)', async () => {
  fetchMock.post('/api/playlists/1/play', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to play playlist: Playlist not found')).toBeInTheDocument();
}, 10000);

test('successfully adjusts the playback speed (from playbackSpeedControl_removeSongFromPlaylist)', async () => {
  fetchMock.post('/api/playback-speed', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('playback-speed'), { target: { value: '1.5' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('speed-adjusted')).toBeInTheDocument();
}, 10000);

test('fails to adjust the playback speed due to validation error (from playbackSpeedControl_removeSongFromPlaylist)', async () => {
  fetchMock.post('/api/playback-speed', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('playback-speed'), { target: { value: '1.5' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid playback speed. Please select a value between 0.5 and 2.')).toBeInTheDocument();
}, 10000);

test('successfully removes a song from a playlist (from playbackSpeedControl_removeSongFromPlaylist)', async () => {
  fetchMock.delete('/api/playlists/1/songs/1', 200);

  await act(async () => { render(<MemoryRouter><App playlistId={1} songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Song removed from playlist')).toBeInTheDocument();
}, 10000);

test('fails to remove a non-existing song from the playlist (from playbackSpeedControl_removeSongFromPlaylist)', async () => {
  fetchMock.delete('/api/playlists/1/songs/1', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove song: Song not found')).toBeInTheDocument();
}, 10000);

