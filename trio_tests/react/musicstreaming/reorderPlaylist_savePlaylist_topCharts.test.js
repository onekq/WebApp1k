import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './reorderPlaylist_savePlaylist_topCharts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully reorders songs in a playlist', async () => {
  fetchMock.put('/api/playlists/1/reorder', 200);

  await act(async () => { render(<MemoryRouter><App playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.dragAndDrop(screen.getByTestId('song-1'), screen.getByTestId('song-2')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playlist reordered successfully')).toBeInTheDocument();
}, 10000);

test('fails to reorder songs in a non-existing playlist', async () => {
  fetchMock.put('/api/playlists/1/reorder', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.dragAndDrop(screen.getByTestId('song-1'), screen.getByTestId('song-2')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to reorder playlist: Playlist not found')).toBeInTheDocument();
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

test('Top charts display the top songs correctly.', async () => {
  fetchMock.get('/charts/top', { songs: [{ id: 1, name: 'TopChartSong' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Top Charts')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TopChartSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when top charts fail to display.', async () => {
  fetchMock.get('/charts/top', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Top Charts')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);
