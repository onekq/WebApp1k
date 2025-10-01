import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addSongToPlaylist_crossfade_explicitContentFilter';

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

test('Crossfade - success shows crossfade activated message', async () => {
  fetchMock.post('/api/crossfade', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Crossfade')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Crossfade activated')).toBeInTheDocument();
}, 10000);

test('Crossfade - failure shows error message', async () => {
  fetchMock.post('/api/crossfade', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Crossfade')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to activate crossfade')).toBeInTheDocument();
}, 10000);

test('successfully filters explicit content', async () => {
  fetchMock.get('/api/songs?explicit=false', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('content-filter'), { target: { value: 'false' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('song-list')).toBeInTheDocument();
}, 10000);

test('fails to filter explicit content because no songs match the filter', async () => {
  fetchMock.get('/api/songs?explicit=false', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('content-filter'), { target: { value: 'false' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No explicit songs found.')).toBeInTheDocument();
}, 10000);
