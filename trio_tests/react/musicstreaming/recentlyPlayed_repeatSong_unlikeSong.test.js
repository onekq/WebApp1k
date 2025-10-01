import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './recentlyPlayed_repeatSong_unlikeSong';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Recently played songs are logged correctly.', async () => {
  fetchMock.get('/api/recentlyPlayed', [{ song: 'Song 1' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Song 1')).toBeInTheDocument();
}, 10000);

test('Recently played songs fail to log with an error message.', async () => {
  fetchMock.get('/api/recentlyPlayed', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error retrieving recently played songs')).toBeInTheDocument();
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

test('Unliking a song removes it from the user\'s favorites.', async () => {
  fetchMock.post('/api/unlikeSong', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Unliking a song fails with an error message.', async () => {
  fetchMock.post('/api/unlikeSong', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error unliking the song')).toBeInTheDocument();
}, 10000);
