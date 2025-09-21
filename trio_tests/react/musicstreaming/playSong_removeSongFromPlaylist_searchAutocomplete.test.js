import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './playSong_removeSongFromPlaylist_searchAutocomplete';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('successfully removes a song from a playlist', async () => {
  fetchMock.delete('/api/playlists/1/songs/1', 200);

  await act(async () => { render(<MemoryRouter><RemoveSongFromPlaylist playlistId={1} songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Song removed from playlist')).toBeInTheDocument();
}, 10000);

test('fails to remove a non-existing song from the playlist', async () => {
  fetchMock.delete('/api/playlists/1/songs/1', 404);

  await act(async () => { render(<MemoryRouter><RemoveSongFromPlaylist playlistId={1} songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove song: Song not found')).toBeInTheDocument();
}, 10000);

test('Search autocomplete suggests correct terms.', async () => {
  fetchMock.get('/search/autocomplete?query=Test', { suggestions: ['TestSong'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Test' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when search autocomplete fails.', async () => {
  fetchMock.get('/search/autocomplete?query=Test', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Test' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);
