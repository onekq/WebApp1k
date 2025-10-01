import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './continueListening_createPlaylist_skipToSpecificSongInQueue';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully resumes playback where user left off', async () => {
  fetchMock.get('/api/continue-listening', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('continue-listening')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('resume-playback')).toBeInTheDocument();
}, 10000);

test('fails to resume playback due to session timeout', async () => {
  fetchMock.get('/api/continue-listening', 401);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('continue-listening')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Session timed out. Please log in again.')).toBeInTheDocument();
}, 10000);

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

test('Skipping to a specific song in the queue works.', async () => {
  fetchMock.post('/api/skipTo', 200);

  await act(async () => { render(<MemoryRouter><QueueComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('skip-to-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Skipping to a specific song in the queue fails with an error message.', async () => {
  fetchMock.post('/api/skipTo', 500);

  await act(async () => { render(<MemoryRouter><QueueComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('skip-to-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error skipping to the song')).toBeInTheDocument();
}, 10000);
