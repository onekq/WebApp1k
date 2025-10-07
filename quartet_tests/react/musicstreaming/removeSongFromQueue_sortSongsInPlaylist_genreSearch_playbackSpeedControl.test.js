import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removeSongFromQueue_sortSongsInPlaylist_genreSearch_playbackSpeedControl';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully removes song from playback queue (from removeSongFromQueue_sortSongsInPlaylist)', async () => {
  fetchMock.post('/api/remove-from-queue', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-from-queue')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('removal-success')).toBeInTheDocument();
}, 10000);

test('fails to remove song from playback queue due to server error (from removeSongFromQueue_sortSongsInPlaylist)', async () => {
  fetchMock.post('/api/remove-from-queue', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-from-queue')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove song from queue. Please try again.')).toBeInTheDocument();
}, 10000);

test('successfully sorts songs within a playlist by name (from removeSongFromQueue_sortSongsInPlaylist)', async () => {
  fetchMock.get('/api/playlists/1/songs?sort=name', [{ id: 1, name: 'A Song' }, { id: 2, name: 'B Song' }]);

  await act(async () => { render(<MemoryRouter><App playlistId={1} sortBy="name" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-songs-by-name-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Songs sorted by name within playlist')).toBeInTheDocument();
}, 10000);

test('fails to sort songs within a playlist due to empty playlist (from removeSongFromQueue_sortSongsInPlaylist)', async () => {
  fetchMock.get('/api/playlists/1/songs?sort=name', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} sortBy="name" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-songs-by-name-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort songs: No songs found')).toBeInTheDocument();
}, 10000);

test('Searching for a genre by name returns accurate results. (from genreSearch_playbackSpeedControl)', async () => {
  fetchMock.get('/genres?name=TestGenre', { genres: [{ id: 1, name: 'TestGenre' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search genres'), { target: { value: 'TestGenre' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestGenre')).toBeInTheDocument();
}, 10000);

test('Shows error message when searching for a genre by name fails. (from genreSearch_playbackSpeedControl)', async () => {
  fetchMock.get('/genres?name=TestGenre', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search genres'), { target: { value: 'TestGenre' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

test('successfully adjusts the playback speed (from genreSearch_playbackSpeedControl)', async () => {
  fetchMock.post('/api/playback-speed', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('playback-speed'), { target: { value: '1.5' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('speed-adjusted')).toBeInTheDocument();
}, 10000);

test('fails to adjust the playback speed due to validation error (from genreSearch_playbackSpeedControl)', async () => {
  fetchMock.post('/api/playback-speed', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('playback-speed'), { target: { value: '1.5' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid playback speed. Please select a value between 0.5 and 2.')).toBeInTheDocument();
}, 10000);

