import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addSongToPlaylist_artistSearch';

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

test('Searching for an artist by name returns accurate results.', async () => {
  fetchMock.get('/artists?name=TestArtist', { artists: [{ id: 1, name: 'TestArtist' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search artists'), { target: { value: 'TestArtist' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestArtist')).toBeInTheDocument();
}, 10000);

test('Shows error message when searching for an artist by name fails.', async () => {
  fetchMock.get('/artists?name=TestArtist', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search artists'), { target: { value: 'TestArtist' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);