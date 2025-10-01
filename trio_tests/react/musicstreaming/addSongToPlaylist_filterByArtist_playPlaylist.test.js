import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addSongToPlaylist_filterByArtist_playPlaylist';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds a song to a playlist', async () => {
  fetchMock.post('/api/playlists/1/songs', { id: 1, name: 'New Song' });

  await act(async () => { render(<MemoryRouter><App playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('song-name-input'), { target: { value: 'New Song' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Song added to playlist')).toBeInTheDocument();
}, 10000);

test('fails to add a song to a playlist that does not exist', async () => {
  fetchMock.post('/api/playlists/1/songs', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('song-name-input'), { target: { value: 'New Song' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add song: Playlist not found')).toBeInTheDocument();
}, 10000);

test('successfully filters songs by artist', async () => {
  fetchMock.get('/api/songs?artist=JohnDoe', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('artist-filter'), { target: { value: 'JohnDoe' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('song-list')).toBeInTheDocument();
}, 10000);

test('fails to filter songs by artist because no songs match the filter', async () => {
  fetchMock.get('/api/songs?artist=UnknownArtist', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('artist-filter'), { target: { value: 'UnknownArtist' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No songs found for the selected artist.')).toBeInTheDocument();
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
