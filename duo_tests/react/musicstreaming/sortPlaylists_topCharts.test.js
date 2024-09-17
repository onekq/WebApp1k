import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sortPlaylists_topCharts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully sorts playlists by name', async () => {
  fetchMock.get('/api/playlists?sort=name', [{ id: 1, name: 'A Playlist' }, { id: 2, name: 'B Playlist' }]);

  await act(async () => { render(<MemoryRouter><App sortBy="name" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-name-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playlists sorted by name')).toBeInTheDocument();
}, 10000);

test('fails to sort playlists by name due to empty list', async () => {
  fetchMock.get('/api/playlists?sort=name', 404);

  await act(async () => { render(<MemoryRouter><App sortBy="name" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-name-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort playlists: No playlists found')).toBeInTheDocument();
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