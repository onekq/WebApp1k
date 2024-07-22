import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import DeletePlaylist from './deletePlaylist';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully deletes a playlist', async () => {
  fetchMock.delete('/api/playlists/1', 200);

  await act(async () => { render(<MemoryRouter><DeletePlaylist playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playlist deleted successfully')).toBeInTheDocument();
}, 10000);

test('fails to delete a non-existing playlist', async () => {
  fetchMock.delete('/api/playlists/1', 404);

  await act(async () => { render(<MemoryRouter><DeletePlaylist playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete playlist: Playlist not found')).toBeInTheDocument();
}, 10000);

