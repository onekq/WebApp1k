import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SavePlaylist from './savePlaylist';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully saves changes to a playlist', async () => {
  fetchMock.put('/api/playlists/1', 200);

  await act(async () => { render(<MemoryRouter><SavePlaylist playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playlist saved successfully')).toBeInTheDocument();
}, 10000);

test('fails to save changes to a non-existing playlist', async () => {
  fetchMock.put('/api/playlists/1', 404);

  await act(async () => { render(<MemoryRouter><SavePlaylist playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save playlist: Playlist not found')).toBeInTheDocument();
}, 10000);

