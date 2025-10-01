import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addSongToQueue_viewArtistPage_volumeControl';

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

test('Viewing an artist\'s page shows correct information.', async () => {
  fetchMock.get('/api/artist/1', { name: 'Artist Name', bio: 'Artist Bio' });

  await act(async () => { render(<MemoryRouter><App artistId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Artist Name')).toBeInTheDocument();
}, 10000);

test('Viewing an artist\'s page fails with an error message.', async () => {
  fetchMock.get('/api/artist/1', 500);

  await act(async () => { render(<MemoryRouter><App artistId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading artist information')).toBeInTheDocument();
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
