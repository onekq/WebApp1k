import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createPlaylist_filterByPopularity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('successfully filters songs by popularity', async () => {
  fetchMock.get('/api/songs?popularity=high', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('popularity-filter'), { target: { value: 'high' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('song-list')).toBeInTheDocument();
}, 10000);

test('fails to filter songs by popularity because no songs match the filter', async () => {
  fetchMock.get('/api/songs?popularity=high', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('popularity-filter'), { target: { value: 'high' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No popular songs found.')).toBeInTheDocument();
}, 10000);