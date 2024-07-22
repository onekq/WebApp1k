import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './trendingSongs';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Trending songs feature shows current popular songs.', async () => {
  fetchMock.get('/songs/trending', { songs: [{ id: 1, name: 'TrendingSong' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Trending Songs')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TrendingSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when trending songs feature fails.', async () => {
  fetchMock.get('/songs/trending', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Trending Songs')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

