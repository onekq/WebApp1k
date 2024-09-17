import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './playSongPreview_sortSongsInPlaylist';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Playing a preview of a song works.', async () => {
  fetchMock.post('/api/playPreview', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-preview-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('preview-playing')).toBeInTheDocument();
}, 10000);

test('Playing a preview of a song fails with an error message.', async () => {
  fetchMock.post('/api/playPreview', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-preview-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error playing preview')).toBeInTheDocument();
}, 10000);

test('successfully sorts songs within a playlist by name', async () => {
  fetchMock.get('/api/playlists/1/songs?sort=name', [{ id: 1, name: 'A Song' }, { id: 2, name: 'B Song' }]);

  await act(async () => { render(<MemoryRouter><App playlistId={1} sortBy="name" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-songs-by-name-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Songs sorted by name within playlist')).toBeInTheDocument();
}, 10000);

test('fails to sort songs within a playlist due to empty playlist', async () => {
  fetchMock.get('/api/playlists/1/songs?sort=name', 404);

  await act(async () => { render(<MemoryRouter><App playlistId={1} sortBy="name" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-songs-by-name-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort songs: No songs found')).toBeInTheDocument();
}, 10000);