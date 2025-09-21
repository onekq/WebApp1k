import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './genreSearch_recentlyPlayed_sortPlaylists';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Searching for a genre by name returns accurate results.', async () => {
  fetchMock.get('/genres?name=TestGenre', { genres: [{ id: 1, name: 'TestGenre' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search genres'), { target: { value: 'TestGenre' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestGenre')).toBeInTheDocument();
}, 10000);

test('Shows error message when searching for a genre by name fails.', async () => {
  fetchMock.get('/genres?name=TestGenre', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search genres'), { target: { value: 'TestGenre' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

test('Recently played songs are logged correctly.', async () => {
  fetchMock.get('/api/recentlyPlayed', [{ song: 'Song 1' }]);

  await act(async () => { render(<MemoryRouter><RecentlyPlayed /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Song 1')).toBeInTheDocument();
}, 10000);

test('Recently played songs fail to log with an error message.', async () => {
  fetchMock.get('/api/recentlyPlayed', 500);

  await act(async () => { render(<MemoryRouter><RecentlyPlayed /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error retrieving recently played songs')).toBeInTheDocument();
}, 10000);

test('successfully sorts playlists by name', async () => {
  fetchMock.get('/api/playlists?sort=name', [{ id: 1, name: 'A Playlist' }, { id: 2, name: 'B Playlist' }]);

  await act(async () => { render(<MemoryRouter><SortPlaylists sortBy="name" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-name-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playlists sorted by name')).toBeInTheDocument();
}, 10000);

test('fails to sort playlists by name due to empty list', async () => {
  fetchMock.get('/api/playlists?sort=name', 404);

  await act(async () => { render(<MemoryRouter><SortPlaylists sortBy="name" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-name-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort playlists: No playlists found')).toBeInTheDocument();
}, 10000);
