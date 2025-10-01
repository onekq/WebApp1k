import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchBlizzardWarnings_fetchWeatherByCityName_storeUserSevereWeatherAlertPreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('fetchBlizzardWarnings successfully retrieves blizzard warnings', async () => {
  fetchMock.getOnce('/api/blizzard-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Blizzard Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Blizzard Warnings')); });

  expect(fetchMock.called('/api/blizzard-warnings')).toBeTruthy();
  expect(screen.getByText(/Blizzard Warning/)).toBeInTheDocument();
}, 10000);

test('fetchBlizzardWarnings fails to retrieve blizzard warnings', async () => {
  fetchMock.getOnce('/api/blizzard-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Blizzard Warnings')); });

  expect(fetchMock.called('/api/blizzard-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve blizzard warnings/)).toBeInTheDocument();
}, 10000);

test('Fetch weather by city name succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { city: 'New York', temperature: 20 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 20')).toBeInTheDocument();
}, 10000);

test('Fetch weather by city name fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'InvalidCity' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('City not found')).toBeInTheDocument();
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
