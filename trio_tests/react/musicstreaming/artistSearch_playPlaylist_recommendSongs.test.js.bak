import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './artistSearch_playPlaylist_recommendSongs';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('successfully plays a playlist', async () => {
  fetchMock.post('/api/playlists/1/play', 200);

  await act(async () => { render(<MemoryRouter><PlayPlaylist playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playing playlist')).toBeInTheDocument();
}, 10000);

test('fails to play a non-existing playlist', async () => {
  fetchMock.post('/api/playlists/1/play', 404);

  await act(async () => { render(<MemoryRouter><PlayPlaylist playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to play playlist: Playlist not found')).toBeInTheDocument();
}, 10000);

test('Recommendation system suggests songs based on listening history.', async () => {
  fetchMock.get('/recommend/songs', { songs: [{ id: 1, name: 'RecommendedSong' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recommend Songs')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('RecommendedSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when recommendation system fails to suggest songs.', async () => {
  fetchMock.get('/recommend/songs', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recommend Songs')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);
