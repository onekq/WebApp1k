import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addSongToQueue_playSong_explicitContentFilter_newReleases';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds a song to the playback queue (from addSongToQueue_playSong)', async () => {
  fetchMock.post('/api/queue', { id: 1, name: 'New Song' });

  await act(async () => { render(<MemoryRouter><App songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Song added to queue')).toBeInTheDocument();
}, 10000);

test('fails to add a song to the playback queue due to non-existing song (from addSongToQueue_playSong)', async () => {
  fetchMock.post('/api/queue', 404);

  await act(async () => { render(<MemoryRouter><App songId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add song to queue: Song not found')).toBeInTheDocument();
}, 10000);

test('Play Song - success shows playback started message (from addSongToQueue_playSong)', async () => {
  fetchMock.post('/api/play-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Play Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playback started')).toBeInTheDocument();
}, 10000);

test('Play Song - failure shows error message (from addSongToQueue_playSong)', async () => {
  fetchMock.post('/api/play-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Play Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to start playback')).toBeInTheDocument();
}, 10000);

test('successfully filters explicit content (from explicitContentFilter_newReleases)', async () => {
  fetchMock.get('/api/songs?explicit=false', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('content-filter'), { target: { value: 'false' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('song-list')).toBeInTheDocument();
}, 10000);

test('fails to filter explicit content because no songs match the filter (from explicitContentFilter_newReleases)', async () => {
  fetchMock.get('/api/songs?explicit=false', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('content-filter'), { target: { value: 'false' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No explicit songs found.')).toBeInTheDocument();
}, 10000);

test('New releases are shown appropriately. (from explicitContentFilter_newReleases)', async () => {
  fetchMock.get('/songs/new', { songs: [{ id: 1, name: 'NewReleaseSong' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('New Releases')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('NewReleaseSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when new releases fail to load. (from explicitContentFilter_newReleases)', async () => {
  fetchMock.get('/songs/new', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('New Releases')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

