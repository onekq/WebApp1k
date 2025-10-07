import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByPopularity_playbackQueue_removeSongFromPlaylist_songSearch';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully filters songs by popularity (from filterByPopularity_playbackQueue)', async () => {
  fetchMock.get('/api/songs?popularity=high', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('popularity-filter'), { target: { value: 'high' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('song-list')).toBeInTheDocument();
}, 10000);

test('fails to filter songs by popularity because no songs match the filter (from filterByPopularity_playbackQueue)', async () => {
  fetchMock.get('/api/songs?popularity=high', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('popularity-filter'), { target: { value: 'high' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No popular songs found.')).toBeInTheDocument();
}, 10000);

test('Songs are added to the playback queue correctly. (from filterByPopularity_playbackQueue)', async () => {
  fetchMock.post('/api/queue', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Songs fail to add to the playback queue with an error message. (from filterByPopularity_playbackQueue)', async () => {
  fetchMock.post('/api/queue', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding song to the queue')).toBeInTheDocument();
}, 10000);

test('successfully removes a song from a playlist (from removeSongFromPlaylist_songSearch)', async () => {
  fetchMock.delete('/api/playlists/1/songs/1', 200);

  await act(async () => { render(<MemoryRouter><App playlistId={1} songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Song removed from playlist')).toBeInTheDocument();
}, 10000);

test('fails to remove a non-existing song from the playlist (from removeSongFromPlaylist_songSearch)', async () => {
  fetchMock.delete('/api/playlists/1/songs/1', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove song: Song not found')).toBeInTheDocument();
}, 10000);

test('Searching for a song by name returns accurate results. (from removeSongFromPlaylist_songSearch)', async () => {
  fetchMock.get('/songs?name=TestSong', { songs: [{ id: 1, name: 'TestSong' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search songs'), { target: { value: 'TestSong' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when searching for a song by name fails. (from removeSongFromPlaylist_songSearch)', async () => {
  fetchMock.get('/songs?name=TestSong', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search songs'), { target: { value: 'TestSong' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

