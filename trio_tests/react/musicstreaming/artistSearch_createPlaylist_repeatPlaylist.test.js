import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './artistSearch_createPlaylist_repeatPlaylist';

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

test('successfully creates a new playlist', async () => {
  fetchMock.post('/api/playlists', { id: 1, name: 'New Playlist' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('playlist-name-input'), { target: { value: 'New Playlist' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('create-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playlist created successfully')).toBeInTheDocument();
}, 10000);

test('fails to create a new playlist with missing name', async () => {
  fetchMock.post('/api/playlists', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('create-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playlist creation failed: Name is required')).toBeInTheDocument();
}, 10000);

test('Repeat Playlist - success shows repeat playlist mode activated message', async () => {
  fetchMock.post('/api/repeat-playlist', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Repeat Playlist')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Repeat playlist mode activated')).toBeInTheDocument();
}, 10000);

test('Repeat Playlist - failure shows error message', async () => {
  fetchMock.post('/api/repeat-playlist', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Repeat Playlist')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to activate repeat playlist mode')).toBeInTheDocument();
}, 10000);
