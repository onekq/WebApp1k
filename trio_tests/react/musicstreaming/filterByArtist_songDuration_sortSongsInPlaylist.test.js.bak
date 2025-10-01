import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByArtist_songDuration_sortSongsInPlaylist';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('The song duration is displayed correctly.', async () => {
  fetchMock.get('/api/song/1', { duration: '3:45' });

  await act(async () => { render(<MemoryRouter><SongComponent songId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('3:45')).toBeInTheDocument();
}, 10000);

test('The song duration fails to display with an error message.', async () => {
  fetchMock.get('/api/song/1', 500);

  await act(async () => { render(<MemoryRouter><SongComponent songId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading song duration')).toBeInTheDocument();
}, 10000);

test('successfully sorts songs within a playlist by name', async () => {
  fetchMock.get('/api/playlists/1/songs?sort=name', [{ id: 1, name: 'A Song' }, { id: 2, name: 'B Song' }]);

  await act(async () => { render(<MemoryRouter><SortSongsInPlaylist playlistId={1} sortBy="name" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-songs-by-name-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Songs sorted by name within playlist')).toBeInTheDocument();
}, 10000);

test('fails to sort songs within a playlist due to empty playlist', async () => {
  fetchMock.get('/api/playlists/1/songs?sort=name', 404);

  await act(async () => { render(<MemoryRouter><SortSongsInPlaylist playlistId={1} sortBy="name" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-songs-by-name-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort songs: No songs found')).toBeInTheDocument();
}, 10000);
