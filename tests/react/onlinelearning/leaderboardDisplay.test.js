import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import LeaderboardDisplay from './leaderboardDisplay';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully displays leaderboard', async () => {
  fetchMock.get('/leaderboard', { status: 200, body: [{ id: 1, leader: 'User 1' }] });

  await act(async () => { render(<MemoryRouter><LeaderboardDisplay /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('User 1')).toBeInTheDocument();
}, 10000);

test('Fails to display leaderboard', async () => {
  fetchMock.get('/leaderboard', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><LeaderboardDisplay /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Leaderboard failed')).toBeInTheDocument();
}, 10000);

