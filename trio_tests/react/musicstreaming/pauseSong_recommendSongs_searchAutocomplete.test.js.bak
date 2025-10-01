import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './pauseSong_recommendSongs_searchAutocomplete';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Pause Song - success shows playback paused message', async () => {
  fetchMock.post('/api/pause-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pause Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playback paused')).toBeInTheDocument();
}, 10000);

test('Pause Song - failure shows error message', async () => {
  fetchMock.post('/api/pause-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pause Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to pause playback')).toBeInTheDocument();
}, 10000);

test('Recommendation system suggests songs based on listening history.', async () => {
  fetchMock.get('/recommend/songs', { songs: [{ id: 1, name: 'RecommendedSong' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recommend Songs')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('RecommendedSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when recommendation system fails to suggest songs.', async () => {
  fetchMock.get('/recommend/songs', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Recommend Songs')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

test('Search autocomplete suggests correct terms.', async () => {
  fetchMock.get('/search/autocomplete?query=Test', { suggestions: ['TestSong'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Test' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when search autocomplete fails.', async () => {
  fetchMock.get('/search/autocomplete?query=Test', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Test' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);
