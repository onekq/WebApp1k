import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './songSearch';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

