import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareProgressWithFriends_provideWeatherUpdates_logSleepHours_setTargetHeartRateZone';

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

test('logs sleep hours successfully and displays hours in the list (from logSleepHours_setTargetHeartRateZone)', async () => {
  fetchMock.post('/api/log-sleep', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter sleep hours'), { target: { value: '8' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Sleep')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sleep hours logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log sleep hours and displays an error message (from logSleepHours_setTargetHeartRateZone)', async () => {
  fetchMock.post('/api/log-sleep', { status: 400, body: { error: 'Invalid hours' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter sleep hours'), { target: { value: '-5' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Sleep')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log sleep hours.')).toBeInTheDocument();
}, 10000);

test('should successfully set a target heart rate zone (from logSleepHours_setTargetHeartRateZone)', async () => {
  fetchMock.post('/api/goals/heart-rate', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/heart rate zone/i), { target: { value: '120-150' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set zone/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/zone set successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when setting a target heart rate zone fails (from logSleepHours_setTargetHeartRateZone)', async () => {
  fetchMock.post('/api/goals/heart-rate', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/heart rate zone/i), { target: { value: '120-150' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set zone/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to set zone/i)).toBeInTheDocument();
}, 10000);

