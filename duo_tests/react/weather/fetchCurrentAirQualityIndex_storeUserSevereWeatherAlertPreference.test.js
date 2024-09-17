import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentAirQualityIndex_storeUserSevereWeatherAlertPreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully retrieves the current air quality index for a given location', async () => {
  fetchMock.get('/api/current-aqi?location=NYC', { aqi: 42 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get AQI')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('42')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current air quality index if the API returns an error', async () => {
  fetchMock.get('/api/current-aqi?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get AQI')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching AQI')).toBeInTheDocument();
}, 10000);

test('correctly stores user severe weather alert preference', async () => {
  fetchMock.post('/preferences/weather-alerts', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('alerts-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user severe weather alert preference fails', async () => {
  fetchMock.post('/preferences/weather-alerts', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('alerts-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);