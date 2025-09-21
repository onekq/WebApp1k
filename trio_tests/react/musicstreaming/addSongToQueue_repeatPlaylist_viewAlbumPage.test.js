import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addSongToQueue_repeatPlaylist_viewAlbumPage';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully adds a song to the playback queue', async () => {
  fetchMock.post('/api/queue', { id: 1, name: 'New Song' });

  await act(async () => { render(<MemoryRouter><AddSongToQueue songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Song added to queue')).toBeInTheDocument();
}, 10000);

test('fails to add a song to the playback queue due to non-existing song', async () => {
  fetchMock.post('/api/queue', 404);

  await act(async () => { render(<MemoryRouter><AddSongToQueue songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add song to queue: Song not found')).toBeInTheDocument();
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

test('Viewing an album\'s page shows correct information.', async () => {
  fetchMock.get('/api/album/1', { title: 'Album Title' });

  await act(async () => { render(<MemoryRouter><AlbumPage albumId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Album Title')).toBeInTheDocument();
}, 10000);

test('Viewing an album\'s page fails with an error message.', async () => {
  fetchMock.get('/api/album/1', 500);

  await act(async () => { render(<MemoryRouter><AlbumPage albumId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading album information')).toBeInTheDocument();
}, 10000);
