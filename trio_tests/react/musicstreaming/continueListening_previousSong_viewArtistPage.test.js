import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './continueListening_previousSong_viewArtistPage';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully resumes playback where user left off', async () => {
  fetchMock.get('/api/continue-listening', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('continue-listening')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('resume-playback')).toBeInTheDocument();
}, 10000);

test('fails to resume playback due to session timeout', async () => {
  fetchMock.get('/api/continue-listening', 401);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('continue-listening')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Session timed out. Please log in again.')).toBeInTheDocument();
}, 10000);

test('Previous Song - success shows previous song started message', async () => {
  fetchMock.post('/api/previous-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Previous Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Previous song started')).toBeInTheDocument();
}, 10000);

test('Previous Song - failure shows error message', async () => {
  fetchMock.post('/api/previous-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Previous Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to go back to previous song')).toBeInTheDocument();
}, 10000);

test('Viewing an artist\'s page shows correct information.', async () => {
  fetchMock.get('/api/artist/1', { name: 'Artist Name', bio: 'Artist Bio' });

  await act(async () => { render(<MemoryRouter><ArtistPage artistId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Artist Name')).toBeInTheDocument();
}, 10000);

test('Viewing an artist\'s page fails with an error message.', async () => {
  fetchMock.get('/api/artist/1', 500);

  await act(async () => { render(<MemoryRouter><ArtistPage artistId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading artist information')).toBeInTheDocument();
}, 10000);
