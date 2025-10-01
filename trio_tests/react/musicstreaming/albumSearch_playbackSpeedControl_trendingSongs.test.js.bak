import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './albumSearch_playbackSpeedControl_trendingSongs';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Searching for an album by name returns accurate results.', async () => {
  fetchMock.get('/albums?name=TestAlbum', { albums: [{ id: 1, name: 'TestAlbum' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search albums'), { target: { value: 'TestAlbum' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestAlbum')).toBeInTheDocument();
}, 10000);

test('Shows error message when searching for an album by name fails.', async () => {
  fetchMock.get('/albums?name=TestAlbum', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search albums'), { target: { value: 'TestAlbum' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
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
