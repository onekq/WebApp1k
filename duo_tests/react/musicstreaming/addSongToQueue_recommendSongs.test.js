import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addSongToQueue_recommendSongs';

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

test('Recommendation system suggests songs based on listening history.', async () => {
  fetchMock.get('/recommend/songs', { songs: [{ id: 1, name: 'RecommendedSong' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recommend Songs')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('RecommendedSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when recommendation system fails to suggest songs.', async () => {
  fetchMock.get('/recommend/songs', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recommend Songs')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);