import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchHurricaneWarnings_fetchWeatherByCountry_storeUserSevereWeatherAlertPreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('fetchHurricaneWarnings successfully retrieves hurricane warnings', async () => {
  fetchMock.getOnce('/api/hurricane-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Hurricane Warning' }],
  });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Hurricane Warnings')); });

  expect(fetchMock.called('/api/hurricane-warnings')).toBeTruthy();
  expect(screen.getByText(/Hurricane Warning/)).toBeInTheDocument();
}, 10000);

test('fetchHurricaneWarnings fails to retrieve hurricane warnings', async () => {
  fetchMock.getOnce('/api/hurricane-warnings', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Hurricane Warnings')); });

  expect(fetchMock.called('/api/hurricane-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve hurricane warnings/)).toBeInTheDocument();
}, 10000);

test('Fetch weather by country succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { country: 'USA', temperature: 28 } });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('country-input'), { target: { value: 'USA' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 28')).toBeInTheDocument();
}, 10000);

test('Fetch weather by country fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('country-input'), { target: { value: 'InvalidCountry' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Country not found')).toBeInTheDocument();
}, 10000);

test('correctly stores user severe weather alert preference', async () => {
  fetchMock.post('/preferences/weather-alerts', 200);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('alerts-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user severe weather alert preference fails', async () => {
  fetchMock.post('/preferences/weather-alerts', 500);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('alerts-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);
