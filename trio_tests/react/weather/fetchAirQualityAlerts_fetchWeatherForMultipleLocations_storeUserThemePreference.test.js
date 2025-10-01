import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchAirQualityAlerts_fetchWeatherForMultipleLocations_storeUserThemePreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('fetchAirQualityAlerts successfully retrieves air quality alerts', async () => {
  fetchMock.getOnce('/api/air-quality-alerts', {
    status: 200,
    body: [{ id: 1, alert: 'Air Quality Alert' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Air Quality Alerts')); });

  expect(fetchMock.called('/api/air-quality-alerts')).toBeTruthy();
  expect(screen.getByText(/Air Quality Alert/)).toBeInTheDocument();
}, 10000);

test('fetchAirQualityAlerts fails to retrieve air quality alerts', async () => {
  fetchMock.getOnce('/api/air-quality-alerts', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Air Quality Alerts')); });

  expect(fetchMock.called('/api/air-quality-alerts')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve air quality alerts/)).toBeInTheDocument();
}, 10000);

test('Fetch weather for multiple locations succeeds.', async () => {
  fetchMock.post('/api/weather', { data: [{ location: 'New York', temperature: 20 }, { location: 'Los Angeles', temperature: 25 }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('locations-input'), { target: { value: 'New York, Los Angeles' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('New York: Temperature: 20')).toBeInTheDocument();
  expect(screen.getByText('Los Angeles: Temperature: 25')).toBeInTheDocument();
}, 10000);

test('Fetch weather for multiple locations fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('locations-input'), { target: { value: 'InvalidLocation1, InvalidLocation2' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Locations not found')).toBeInTheDocument();
}, 10000);

test('correctly stores user theme preference', async () => {
  fetchMock.post('/preferences/theme', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('theme-select'), { target: { value: 'dark' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user theme preference fails', async () => {
  fetchMock.post('/preferences/theme', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('theme-select'), { target: { value: 'dark' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);
