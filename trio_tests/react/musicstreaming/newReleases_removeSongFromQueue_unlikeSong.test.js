import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './newReleases_removeSongFromQueue_unlikeSong';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('New releases are shown appropriately.', async () => {
  fetchMock.get('/songs/new', { songs: [{ id: 1, name: 'NewReleaseSong' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('New Releases')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('NewReleaseSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when new releases fail to load.', async () => {
  fetchMock.get('/songs/new', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('New Releases')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

test('successfully removes song from playback queue', async () => {
  fetchMock.post('/api/remove-from-queue', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-from-queue')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('removal-success')).toBeInTheDocument();
}, 10000);

test('fails to remove song from playback queue due to server error', async () => {
  fetchMock.post('/api/remove-from-queue', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-from-queue')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove song from queue. Please try again.')).toBeInTheDocument();
}, 10000);

test('Unliking a song removes it from the user\'s favorites.', async () => {
  fetchMock.post('/api/unlikeSong', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Unliking a song fails with an error message.', async () => {
  fetchMock.post('/api/unlikeSong', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error unliking the song')).toBeInTheDocument();
}, 10000);
