import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import RecentlyPlayed from './recentlyPlayed';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

