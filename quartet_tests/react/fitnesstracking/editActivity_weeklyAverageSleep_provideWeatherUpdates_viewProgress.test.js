import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editActivity_weeklyAverageSleep_provideWeatherUpdates_viewProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can edit an existing fitness activity successfully. (from editActivity_weeklyAverageSleep)', async () => {
  fetchMock.put('/api/editActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Updated Running' } });
    fireEvent.click(screen.getByTestId('submit-edit'));
  });

  expect(fetchMock.called('/api/editActivity')).toBeTruthy();
  expect(screen.getByText('Activity updated successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when editing a fitness activity fails. (from editActivity_weeklyAverageSleep)', async () => {
  fetchMock.put('/api/editActivity', { status: 500, body: { error: 'Failed to edit activity' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Updated Running' } });
    fireEvent.click(screen.getByTestId('submit-edit'));
  });

  expect(fetchMock.called('/api/editActivity')).toBeTruthy();
  expect(screen.getByText('Failed to edit activity')).toBeInTheDocument();
}, 10000);

test('System calculates weekly average sleep hours successfully. (from editActivity_weeklyAverageSleep)', async () => {
  fetchMock.get('/api/average-sleep', { hours: 7 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-sleep')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/7 hours/)).toBeInTheDocument();
}, 10000);

test('System fails to calculate weekly average sleep hours. (from editActivity_weeklyAverageSleep)', async () => {
  fetchMock.get('/api/average-sleep', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-sleep')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching sleep hours/)).toBeInTheDocument();
}, 10000);

test('should provide weather updates successfully. (from provideWeatherUpdates_viewProgress)', async () => {
  fetchMock.get('/api/weather/updates', { status: 200, body: { weather: 'sunny' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('weather-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/weather/updates')).toBe(true);
  expect(screen.getByText('Weather: sunny')).toBeInTheDocument();
}, 10000);

test('should fail to provide weather updates. (from provideWeatherUpdates_viewProgress)', async () => {
  fetchMock.get('/api/weather/updates', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('weather-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/weather/updates')).toBe(true);
  expect(screen.getByText('Failed to fetch weather updates.')).toBeInTheDocument();
}, 10000);

test('should successfully view a graphical progress representation (from provideWeatherUpdates_viewProgress)', async () => {
  fetchMock.get('/api/progress/graph', { status: 200, body: {} });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/progress chart/i)).toBeInTheDocument();
}, 10000);

test('should show error message when viewing a graphical progress representation fails (from provideWeatherUpdates_viewProgress)', async () => {
  fetchMock.get('/api/progress/graph', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to load progress/i)).toBeInTheDocument();
}, 10000);

