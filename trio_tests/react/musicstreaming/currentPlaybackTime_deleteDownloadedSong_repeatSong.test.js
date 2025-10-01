import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './currentPlaybackTime_deleteDownloadedSong_repeatSong';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('The current playback time is updated accurately.', async () => {
  fetchMock.get('/api/playbackTime', { currentTime: '1:23' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('1:23')).toBeInTheDocument();
}, 10000);

test('The current playback time fails to update with an error message.', async () => {
  fetchMock.get('/api/playbackTime', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error updating playback time')).toBeInTheDocument();
}, 10000);

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

test('Repeat Song - success shows repeat song mode activated message', async () => {
  fetchMock.post('/api/repeat-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Repeat Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Repeat song mode activated')).toBeInTheDocument();
}, 10000);

test('Repeat Song - failure shows error message', async () => {
  fetchMock.post('/api/repeat-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Repeat Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to activate repeat song mode')).toBeInTheDocument();
}, 10000);
