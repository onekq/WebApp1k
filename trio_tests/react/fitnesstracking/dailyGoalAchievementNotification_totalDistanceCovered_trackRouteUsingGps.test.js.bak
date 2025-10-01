import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './dailyGoalAchievementNotification_totalDistanceCovered_trackRouteUsingGps';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('System sends a notification when a daily goal is achieved successfully.', async () => {
  fetchMock.post('/api/daily-goal', { status: 'Goal Achieved' });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-goal')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Goal Achieved/)).toBeInTheDocument();
}, 10000);

test('System fails to send a notification when a daily goal is achieved.', async () => {
  fetchMock.post('/api/daily-goal', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-goal')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error checking goal status/)).toBeInTheDocument();
}, 10000);

test('System calculates total distance covered in a week successfully.', async () => {
  fetchMock.get('/api/total-distance', { distance: 50 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-distance')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/50 miles/)).toBeInTheDocument();
}, 10000);

test('System fails to calculate total distance covered in a week.', async () => {
  fetchMock.get('/api/total-distance', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-distance')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching distance/)).toBeInTheDocument();
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
