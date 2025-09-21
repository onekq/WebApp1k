import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './playPlaylist_playSong_playbackQueue';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully plays a playlist', async () => {
  fetchMock.post('/api/playlists/1/play', 200);

  await act(async () => { render(<MemoryRouter><PlayPlaylist playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playing playlist')).toBeInTheDocument();
}, 10000);

test('fails to play a non-existing playlist', async () => {
  fetchMock.post('/api/playlists/1/play', 404);

  await act(async () => { render(<MemoryRouter><PlayPlaylist playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to play playlist: Playlist not found')).toBeInTheDocument();
}, 10000);

test('Play Song - success shows playback started message', async () => {
  fetchMock.post('/api/play-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Play Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playback started')).toBeInTheDocument();
}, 10000);

test('Play Song - failure shows error message', async () => {
  fetchMock.post('/api/play-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Play Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to start playback')).toBeInTheDocument();
}, 10000);

test('Songs are added to the playback queue correctly.', async () => {
  fetchMock.post('/api/queue', 200);

  await act(async () => { render(<MemoryRouter><QueueComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Songs fail to add to the playback queue with an error message.', async () => {
  fetchMock.post('/api/queue', 500);

  await act(async () => { render(<MemoryRouter><QueueComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding song to the queue')).toBeInTheDocument();
}, 10000);
