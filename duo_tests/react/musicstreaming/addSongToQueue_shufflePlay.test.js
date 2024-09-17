import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addSongToQueue_shufflePlay';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a song to the playback queue', async () => {
  fetchMock.post('/api/queue', { id: 1, name: 'New Song' });

  await act(async () => { render(<MemoryRouter><App songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Song added to queue')).toBeInTheDocument();
}, 10000);

test('fails to add a song to the playback queue due to non-existing song', async () => {
  fetchMock.post('/api/queue', 404);

  await act(async () => { render(<MemoryRouter><App songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add song to queue: Song not found')).toBeInTheDocument();
}, 10000);

test('Shuffle Play - success shows shuffle mode activated message', async () => {
  fetchMock.post('/api/shuffle-play', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Shuffle Play')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shuffle mode activated')).toBeInTheDocument();
}, 10000);

test('Shuffle Play - failure shows error message', async () => {
  fetchMock.post('/api/shuffle-play', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Shuffle Play')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to activate shuffle mode')).toBeInTheDocument();
}, 10000);