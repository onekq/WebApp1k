import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchBlizzardWarnings_fetchWeatherForUsersCurrentLocation_fetchWildfireAlerts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('fetchBlizzardWarnings successfully retrieves blizzard warnings', async () => {
  fetchMock.getOnce('/api/blizzard-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Blizzard Warning' }],
  });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Blizzard Warnings')); });

  expect(fetchMock.called('/api/blizzard-warnings')).toBeTruthy();
  expect(screen.getByText(/Blizzard Warning/)).toBeInTheDocument();
}, 10000);

test('fetchBlizzardWarnings fails to retrieve blizzard warnings', async () => {
  fetchMock.getOnce('/api/blizzard-warnings', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Blizzard Warnings')); });

  expect(fetchMock.called('/api/blizzard-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve blizzard warnings/)).toBeInTheDocument();
}, 10000);

test('Fetch weather for user\'s current location succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { location: 'Current Location', temperature: 30 } });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Current Location')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 30')).toBeInTheDocument();
}, 10000);

test('Fetch weather for user\'s current location fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Current Location')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Current location not found')).toBeInTheDocument();
}, 10000);

test('fetchWildfireAlerts successfully retrieves wildfire alerts', async () => {
  fetchMock.getOnce('/api/wildfire-alerts', {
    status: 200,
    body: [{ id: 1, alert: 'Wildfire Alert' }],
  });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Wildfire Alerts')); });

  expect(fetchMock.called('/api/wildfire-alerts')).toBeTruthy();
  expect(screen.getByText(/Wildfire Alert/)).toBeInTheDocument();
}, 10000);

test('fetchWildfireAlerts fails to retrieve wildfire alerts', async () => {
  fetchMock.getOnce('/api/wildfire-alerts', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Wildfire Alerts')); });

  expect(fetchMock.called('/api/wildfire-alerts')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve wildfire alerts/)).toBeInTheDocument();
}, 10000);
