import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './currentPlaybackTime_discoverNewArtists_newReleases';

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

test('Discovery feature suggests new artists based on user preferences.', async () => {
  fetchMock.get('/discover/new-artists', { artists: [{ id: 1, name: 'NewArtist' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Discover New Artists')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('NewArtist')).toBeInTheDocument();
}, 10000);

test('Shows error message when discovery feature fails to suggest new artists.', async () => {
  fetchMock.get('/discover/new-artists', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Discover New Artists')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

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
