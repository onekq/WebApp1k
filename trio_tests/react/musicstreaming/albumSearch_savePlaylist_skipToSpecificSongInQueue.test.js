import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './albumSearch_savePlaylist_skipToSpecificSongInQueue';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Searching for an album by name returns accurate results.', async () => {
  fetchMock.get('/albums?name=TestAlbum', { albums: [{ id: 1, name: 'TestAlbum' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search albums'), { target: { value: 'TestAlbum' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestAlbum')).toBeInTheDocument();
}, 10000);

test('Shows error message when searching for an album by name fails.', async () => {
  fetchMock.get('/albums?name=TestAlbum', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search albums'), { target: { value: 'TestAlbum' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

test('successfully saves changes to a playlist', async () => {
  fetchMock.put('/api/playlists/1', 200);

  await act(async () => { render(<MemoryRouter><App playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playlist saved successfully')).toBeInTheDocument();
}, 10000);

test('fails to save changes to a non-existing playlist', async () => {
  fetchMock.put('/api/playlists/1', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save playlist: Playlist not found')).toBeInTheDocument();
}, 10000);

test('Skipping to a specific song in the queue works.', async () => {
  fetchMock.post('/api/skipTo', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('skip-to-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Skipping to a specific song in the queue fails with an error message.', async () => {
  fetchMock.post('/api/skipTo', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('skip-to-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error skipping to the song')).toBeInTheDocument();
}, 10000);
