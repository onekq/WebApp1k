import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteDownloadedSong_pauseSong_playbackQueue';

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

test('Pause Song - success shows playback paused message', async () => {
  fetchMock.post('/api/pause-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pause Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playback paused')).toBeInTheDocument();
}, 10000);

test('Pause Song - failure shows error message', async () => {
  fetchMock.post('/api/pause-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pause Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to pause playback')).toBeInTheDocument();
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
