import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createPlaylist_explicitContentFilter_volumeControl';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully creates a new playlist', async () => {
  fetchMock.post('/api/playlists', { id: 1, name: 'New Playlist' });

  await act(async () => { render(<MemoryRouter><CreatePlaylist /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('playlist-name-input'), { target: { value: 'New Playlist' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('create-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playlist created successfully')).toBeInTheDocument();
}, 10000);

test('fails to create a new playlist with missing name', async () => {
  fetchMock.post('/api/playlists', 400);

  await act(async () => { render(<MemoryRouter><CreatePlaylist /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('create-playlist-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playlist creation failed: Name is required')).toBeInTheDocument();
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

test('Volume Control - success shows volume changed message', async () => {
  fetchMock.post('/api/set-volume', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('volume-slider'), { target: { value: '50' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Volume set to 50')).toBeInTheDocument();
}, 10000);

test('Volume Control - failure shows error message', async () => {
  fetchMock.post('/api/set-volume', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('volume-slider'), { target: { value: '50' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to change volume')).toBeInTheDocument();
}, 10000);
