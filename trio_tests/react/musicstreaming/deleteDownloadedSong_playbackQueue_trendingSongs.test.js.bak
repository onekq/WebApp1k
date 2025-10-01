import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteDownloadedSong_playbackQueue_trendingSongs';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully deletes a downloaded song', async () => {
  fetchMock.delete('/api/delete-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('delete-success')).toBeInTheDocument();
}, 10000);

test('fails to delete a downloaded song due to server error', async () => {
  fetchMock.delete('/api/delete-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete song. Please try again.')).toBeInTheDocument();
}, 10000);

test('Songs are added to the playback queue correctly.', async () => {
  fetchMock.post('/api/queue', 200);

  await act(async () => { render(<MemoryRouter><QueueComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Songs fail to add to the playback queue with an error message.', async () => {
  fetchMock.post('/api/queue', 500);

  await act(async () => { render(<MemoryRouter><QueueComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding song to the queue')).toBeInTheDocument();
}, 10000);

test('Trending songs feature shows current popular songs.', async () => {
  fetchMock.get('/songs/trending', { songs: [{ id: 1, name: 'TrendingSong' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Trending Songs')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TrendingSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when trending songs feature fails.', async () => {
  fetchMock.get('/songs/trending', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Trending Songs')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);
