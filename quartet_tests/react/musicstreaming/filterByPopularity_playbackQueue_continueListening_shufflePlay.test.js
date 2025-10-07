import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByPopularity_playbackQueue_continueListening_shufflePlay';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully filters songs by popularity (from filterByPopularity_playbackQueue)', async () => {
  fetchMock.get('/api/songs?popularity=high', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('popularity-filter'), { target: { value: 'high' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('song-list')).toBeInTheDocument();
}, 10000);

test('fails to filter songs by popularity because no songs match the filter (from filterByPopularity_playbackQueue)', async () => {
  fetchMock.get('/api/songs?popularity=high', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('popularity-filter'), { target: { value: 'high' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No popular songs found.')).toBeInTheDocument();
}, 10000);

test('Songs are added to the playback queue correctly. (from filterByPopularity_playbackQueue)', async () => {
  fetchMock.post('/api/queue', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Songs fail to add to the playback queue with an error message. (from filterByPopularity_playbackQueue)', async () => {
  fetchMock.post('/api/queue', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding song to the queue')).toBeInTheDocument();
}, 10000);

test('successfully resumes playback where user left off (from continueListening_shufflePlay)', async () => {
  fetchMock.get('/api/continue-listening', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('continue-listening')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('resume-playback')).toBeInTheDocument();
}, 10000);

test('fails to resume playback due to session timeout (from continueListening_shufflePlay)', async () => {
  fetchMock.get('/api/continue-listening', 401);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('continue-listening')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Session timed out. Please log in again.')).toBeInTheDocument();
}, 10000);

test('Shuffle Play - success shows shuffle mode activated message (from continueListening_shufflePlay)', async () => {
  fetchMock.post('/api/shuffle-play', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Shuffle Play')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shuffle mode activated')).toBeInTheDocument();
}, 10000);

test('Shuffle Play - failure shows error message (from continueListening_shufflePlay)', async () => {
  fetchMock.post('/api/shuffle-play', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Shuffle Play')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to activate shuffle mode')).toBeInTheDocument();
}, 10000);

