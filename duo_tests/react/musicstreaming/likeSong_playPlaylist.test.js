import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './likeSong_playPlaylist';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Liking a song adds it to the user\'s favorites.', async () => {
  fetchMock.post('/api/likeSong', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Liking a song fails with an error message.', async () => {
  fetchMock.post('/api/likeSong', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error liking the song')).toBeInTheDocument();
}, 10000);

test('successfully plays a playlist', async () => {
  fetchMock.post('/api/playlists/1/play', 200);

  await act(async () => { render(<MemoryRouter><App playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playing playlist')).toBeInTheDocument();
}, 10000);

test('fails to play a non-existing playlist', async () => {
  fetchMock.post('/api/playlists/1/play', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to play playlist: Playlist not found')).toBeInTheDocument();
}, 10000);