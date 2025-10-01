import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByPopularity_sortSongsInPlaylist_unlikeSong';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully filters songs by popularity', async () => {
  fetchMock.get('/api/songs?popularity=high', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('popularity-filter'), { target: { value: 'high' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('song-list')).toBeInTheDocument();
}, 10000);

test('fails to filter songs by popularity because no songs match the filter', async () => {
  fetchMock.get('/api/songs?popularity=high', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('popularity-filter'), { target: { value: 'high' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No popular songs found.')).toBeInTheDocument();
}, 10000);

test('successfully sorts songs within a playlist by name', async () => {
  fetchMock.get('/api/playlists/1/songs?sort=name', [{ id: 1, name: 'A Song' }, { id: 2, name: 'B Song' }]);

  await act(async () => { render(<MemoryRouter><App playlistId={1} sortBy="name" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-songs-by-name-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Songs sorted by name within playlist')).toBeInTheDocument();
}, 10000);

test('fails to sort songs within a playlist due to empty playlist', async () => {
  fetchMock.get('/api/playlists/1/songs?sort=name', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} sortBy="name" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-songs-by-name-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort songs: No songs found')).toBeInTheDocument();
}, 10000);

test('Unliking a song removes it from the user\'s favorites.', async () => {
  fetchMock.post('/api/unlikeSong', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Unliking a song fails with an error message.', async () => {
  fetchMock.post('/api/unlikeSong', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error unliking the song')).toBeInTheDocument();
}, 10000);
