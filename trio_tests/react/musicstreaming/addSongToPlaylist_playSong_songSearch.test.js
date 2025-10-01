import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addSongToPlaylist_playSong_songSearch';

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

test('Searching for a song by name returns accurate results.', async () => {
  fetchMock.get('/songs?name=TestSong', { songs: [{ id: 1, name: 'TestSong' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search songs'), { target: { value: 'TestSong' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when searching for a song by name fails.', async () => {
  fetchMock.get('/songs?name=TestSong', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search songs'), { target: { value: 'TestSong' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);
