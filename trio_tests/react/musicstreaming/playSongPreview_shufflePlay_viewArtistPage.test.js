import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './playSongPreview_shufflePlay_viewArtistPage';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Playing a preview of a song works.', async () => {
  fetchMock.post('/api/playPreview', 200);

  await act(async () => { render(<MemoryRouter><PreviewComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-preview-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('preview-playing')).toBeInTheDocument();
}, 10000);

test('Playing a preview of a song fails with an error message.', async () => {
  fetchMock.post('/api/playPreview', 500);

  await act(async () => { render(<MemoryRouter><PreviewComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-preview-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error playing preview')).toBeInTheDocument();
}, 10000);

test('Shuffle Play - success shows shuffle mode activated message', async () => {
  fetchMock.post('/api/shuffle-play', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Shuffle Play')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shuffle mode activated')).toBeInTheDocument();
}, 10000);

test('Shuffle Play - failure shows error message', async () => {
  fetchMock.post('/api/shuffle-play', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Shuffle Play')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to activate shuffle mode')).toBeInTheDocument();
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
