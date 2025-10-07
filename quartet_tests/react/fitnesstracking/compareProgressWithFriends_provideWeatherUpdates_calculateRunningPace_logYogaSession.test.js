import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareProgressWithFriends_provideWeatherUpdates_calculateRunningPace_logYogaSession';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can compare their progress with friends successfully. (from compareProgressWithFriends_provideWeatherUpdates)', async () => {
  fetchMock.get('/api/friends-comparison', { comparison: 'Better than average' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-friends-comparison')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Better than average/)).toBeInTheDocument();
}, 10000);

test('User fails to compare their progress with friends. (from compareProgressWithFriends_provideWeatherUpdates)', async () => {
  fetchMock.get('/api/friends-comparison', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-friends-comparison')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching friends comparison/)).toBeInTheDocument();
}, 10000);

test('should provide weather updates successfully. (from compareProgressWithFriends_provideWeatherUpdates)', async () => {
  fetchMock.get('/api/weather/updates', { status: 200, body: { weather: 'sunny' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('weather-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/weather/updates')).toBe(true);
  expect(screen.getByText('Weather: sunny')).toBeInTheDocument();
}, 10000);

test('should fail to provide weather updates. (from compareProgressWithFriends_provideWeatherUpdates)', async () => {
  fetchMock.get('/api/weather/updates', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('weather-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/weather/updates')).toBe(true);
  expect(screen.getByText('Failed to fetch weather updates.')).toBeInTheDocument();
}, 10000);

test('should calculate running pace successfully. (from calculateRunningPace_logYogaSession)', async () => {
  fetchMock.post('/api/pace/calculate', { status: 200, body: { pace: '5:00 min/km' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('time-input'), { target: { value: '25' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('distance-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-pace-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/pace/calculate')).toBe(true);
  expect(screen.getByText('Pace: 5:00 min/km')).toBeInTheDocument();
}, 10000);

test('should fail to calculate running pace. (from calculateRunningPace_logYogaSession)', async () => {
  fetchMock.post('/api/pace/calculate', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('time-input'), { target: { value: '25' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('distance-input'), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-pace-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/pace/calculate')).toBe(true);
  expect(screen.getByText('Failed to calculate pace.')).toBeInTheDocument();
}, 10000);

test('User can log a yoga session successfully. (from calculateRunningPace_logYogaSession)', async () => {
  fetchMock.post('/api/logYogaSession', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('yoga-session-type'), { target: { value: 'Ashtanga' } });
    fireEvent.click(screen.getByTestId('submit-yoga-session'));
  });

  expect(fetchMock.called('/api/logYogaSession')).toBeTruthy();
  expect(screen.getByText('Yoga session logged successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when logging a yoga session fails. (from calculateRunningPace_logYogaSession)', async () => {
  fetchMock.post('/api/logYogaSession', { status: 500, body: { error: 'Failed to log session' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('yoga-session-type'), { target: { value: 'Ashtanga' } });
    fireEvent.click(screen.getByTestId('submit-yoga-session'));
  });

  expect(fetchMock.called('/api/logYogaSession')).toBeTruthy();
  expect(screen.getByText('Failed to log session')).toBeInTheDocument();
}, 10000);

