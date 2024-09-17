import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByReleaseDate_songSearch';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully filters songs by release date', async () => {
  fetchMock.get('/api/songs?release_date=2021', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('release-date-filter'), { target: { value: '2021' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('song-list')).toBeInTheDocument();
}, 10000);

test('fails to filter songs by release date because no songs match the filter', async () => {
  fetchMock.get('/api/songs?release_date=2021', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('release-date-filter'), { target: { value: '2021' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No songs found for the selected release date.')).toBeInTheDocument();
}, 10000);

test('Searching for a song by name returns accurate results.', async () => {
  fetchMock.get('/songs?name=TestSong', { songs: [{ id: 1, name: 'TestSong' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search songs'), { target: { value: 'TestSong' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when searching for a song by name fails.', async () => {
  fetchMock.get('/songs?name=TestSong', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search songs'), { target: { value: 'TestSong' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);