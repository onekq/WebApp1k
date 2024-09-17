import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deletePlaylist_genreSearch';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully deletes a playlist', async () => {
  fetchMock.delete('/api/playlists/1', 200);

  await act(async () => { render(<MemoryRouter><App playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playlist deleted successfully')).toBeInTheDocument();
}, 10000);

test('fails to delete a non-existing playlist', async () => {
  fetchMock.delete('/api/playlists/1', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete playlist: Playlist not found')).toBeInTheDocument();
}, 10000);

test('Searching for a genre by name returns accurate results.', async () => {
  fetchMock.get('/genres?name=TestGenre', { genres: [{ id: 1, name: 'TestGenre' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search genres'), { target: { value: 'TestGenre' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestGenre')).toBeInTheDocument();
}, 10000);

test('Shows error message when searching for a genre by name fails.', async () => {
  fetchMock.get('/genres?name=TestGenre', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search genres'), { target: { value: 'TestGenre' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);