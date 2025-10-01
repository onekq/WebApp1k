import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './crossfade_repeatSong_sortPlaylists';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Crossfade - success shows crossfade activated message', async () => {
  fetchMock.post('/api/crossfade', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Crossfade')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Crossfade activated')).toBeInTheDocument();
}, 10000);

test('Crossfade - failure shows error message', async () => {
  fetchMock.post('/api/crossfade', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Crossfade')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to activate crossfade')).toBeInTheDocument();
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
