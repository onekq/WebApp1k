import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareProgressWithFriends_joinFitnessChallenges_trackRouteUsingGps';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('User can compare their progress with friends successfully.', async () => {
  fetchMock.get('/api/friends-comparison', { comparison: 'Better than average' });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-friends-comparison')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Better than average/)).toBeInTheDocument();
}, 10000);

test('User fails to compare their progress with friends.', async () => {
  fetchMock.get('/api/friends-comparison', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-friends-comparison')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching friends comparison/)).toBeInTheDocument();
}, 10000);

test('should successfully join a fitness challenge', async () => {
  fetchMock.post('/api/challenges/join/123', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><JoinChallenge challengeId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/join challenge/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/joined successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when joining a fitness challenge fails', async () => {
  fetchMock.post('/api/challenges/join/123', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><JoinChallenge challengeId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/join challenge/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to join/i)).toBeInTheDocument();
}, 10000);

test('should track route using GPS successfully.', async () => {
  fetchMock.post('/api/gps/track', { status: 200, body: { route: 'sample-route-data' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-route-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/gps/track')).toBe(true);
  expect(screen.getByText('Route tracked successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to track route using GPS.', async () => {
  fetchMock.post('/api/gps/track', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-route-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/gps/track')).toBe(true);
  expect(screen.getByText('Failed to track route.')).toBeInTheDocument();
}, 10000);
