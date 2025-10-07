import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentAirQualityIndex_storeUserSevereWeatherAlertPreference_fetchCurrentVisibility_fetchTsunamiWarnings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully retrieves the current air quality index for a given location (from fetchCurrentAirQualityIndex_storeUserSevereWeatherAlertPreference)', async () => {
  fetchMock.get('/api/current-aqi?location=NYC', { aqi: 42 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get AQI')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('42')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current air quality index if the API returns an error (from fetchCurrentAirQualityIndex_storeUserSevereWeatherAlertPreference)', async () => {
  fetchMock.get('/api/current-aqi?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get AQI')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching AQI')).toBeInTheDocument();
}, 10000);

test('correctly stores user severe weather alert preference (from fetchCurrentAirQualityIndex_storeUserSevereWeatherAlertPreference)', async () => {
  fetchMock.post('/preferences/weather-alerts', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('alerts-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user severe weather alert preference fails (from fetchCurrentAirQualityIndex_storeUserSevereWeatherAlertPreference)', async () => {
  fetchMock.post('/preferences/weather-alerts', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('alerts-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);

test('Successfully retrieves the current visibility distance for a given location (from fetchCurrentVisibility_fetchTsunamiWarnings)', async () => {
  fetchMock.get('/api/current-visibility?location=NYC', { visibility: 10 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Visibility')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 miles')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current visibility distance if the API returns an error (from fetchCurrentVisibility_fetchTsunamiWarnings)', async () => {
  fetchMock.get('/api/current-visibility?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Visibility')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching visibility')).toBeInTheDocument();
}, 10000);

test('fetchTsunamiWarnings successfully retrieves tsunami warnings (from fetchCurrentVisibility_fetchTsunamiWarnings)', async () => {
  fetchMock.getOnce('/api/tsunami-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Tsunami Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Tsunami Warnings')); });

  expect(fetchMock.called('/api/tsunami-warnings')).toBeTruthy();
  expect(screen.getByText(/Tsunami Warning/)).toBeInTheDocument();
}, 10000);

test('fetchTsunamiWarnings fails to retrieve tsunami warnings (from fetchCurrentVisibility_fetchTsunamiWarnings)', async () => {
  fetchMock.getOnce('/api/tsunami-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Tsunami Warnings')); });

  expect(fetchMock.called('/api/tsunami-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve tsunami warnings/)).toBeInTheDocument();
}, 10000);

