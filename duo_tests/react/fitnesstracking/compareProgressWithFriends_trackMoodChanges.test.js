import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareProgressWithFriends_trackMoodChanges';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can compare their progress with friends successfully.', async () => {
  fetchMock.get('/api/friends-comparison', { comparison: 'Better than average' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-friends-comparison')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Better than average/)).toBeInTheDocument();
}, 10000);

test('User fails to compare their progress with friends.', async () => {
  fetchMock.get('/api/friends-comparison', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-friends-comparison')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching friends comparison/)).toBeInTheDocument();
}, 10000);

test('System tracks mood changes over time related to workout intensity successfully.', async () => {
  fetchMock.get('/api/mood-changes', { data: 'Positive trend' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-mood')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Positive trend/)).toBeInTheDocument();
}, 10000);

test('System fails to track mood changes over time related to workout intensity.', async () => {
  fetchMock.get('/api/mood-changes', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-mood')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching mood changes/)).toBeInTheDocument();
}, 10000);