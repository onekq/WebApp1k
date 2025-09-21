import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './discoverNewArtists_songDuration_topCharts';

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

test('The song duration is displayed correctly.', async () => {
  fetchMock.get('/api/song/1', { duration: '3:45' });

  await act(async () => { render(<MemoryRouter><SongComponent songId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('3:45')).toBeInTheDocument();
}, 10000);

test('The song duration fails to display with an error message.', async () => {
  fetchMock.get('/api/song/1', 500);

  await act(async () => { render(<MemoryRouter><SongComponent songId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading song duration')).toBeInTheDocument();
}, 10000);

test('Top charts display the top songs correctly.', async () => {
  fetchMock.get('/charts/top', { songs: [{ id: 1, name: 'TopChartSong' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Top Charts')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TopChartSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when top charts fail to display.', async () => {
  fetchMock.get('/charts/top', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Top Charts')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);
