import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './discoverNewArtists_filterByPopularity_playbackSpeedControl';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('successfully filters songs by popularity', async () => {
  fetchMock.get('/api/songs?popularity=high', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('popularity-filter'), { target: { value: 'high' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('song-list')).toBeInTheDocument();
}, 10000);

test('fails to filter songs by popularity because no songs match the filter', async () => {
  fetchMock.get('/api/songs?popularity=high', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('popularity-filter'), { target: { value: 'high' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No popular songs found.')).toBeInTheDocument();
}, 10000);

test('successfully adjusts the playback speed', async () => {
  fetchMock.post('/api/playback-speed', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('playback-speed'), { target: { value: '1.5' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('speed-adjusted')).toBeInTheDocument();
}, 10000);

test('fails to adjust the playback speed due to validation error', async () => {
  fetchMock.post('/api/playback-speed', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('playback-speed'), { target: { value: '1.5' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid playback speed. Please select a value between 0.5 and 2.')).toBeInTheDocument();
}, 10000);
