import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchSevereThunderstormWarnings_fetchSevereWeatherAlerts_fetchAirQualityAlerts_fetchCurrentHumidity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('fetchSevereThunderstormWarnings successfully retrieves severe thunderstorm warnings (from fetchSevereThunderstormWarnings_fetchSevereWeatherAlerts)', async () => {
  fetchMock.getOnce('/api/severe-thunderstorm-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Severe Thunderstorm Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Severe Thunderstorm Warnings')); });

  expect(fetchMock.called('/api/severe-thunderstorm-warnings')).toBeTruthy();
  expect(screen.getByText(/Severe Thunderstorm Warning/)).toBeInTheDocument();
}, 10000);

test('fetchSevereThunderstormWarnings fails to retrieve severe thunderstorm warnings (from fetchSevereThunderstormWarnings_fetchSevereWeatherAlerts)', async () => {
  fetchMock.getOnce('/api/severe-thunderstorm-warnings', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Severe Thunderstorm Warnings')); });

  expect(fetchMock.called('/api/severe-thunderstorm-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve severe thunderstorm warnings/)).toBeInTheDocument();
}, 10000);

test('fetchSevereWeatherAlerts successfully retrieves alerts (from fetchSevereThunderstormWarnings_fetchSevereWeatherAlerts)', async () => {
  fetchMock.getOnce('/api/severe-weather-alerts', {
    status: 200,
    body: [{ id: 1, alert: 'Tornado Warning' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Alerts')); });

  expect(fetchMock.called('/api/severe-weather-alerts')).toBeTruthy();
  expect(screen.getByText(/Tornado Warning/)).toBeInTheDocument();
}, 10000);

test('fetchSevereWeatherAlerts fails to retrieve alerts (from fetchSevereThunderstormWarnings_fetchSevereWeatherAlerts)', async () => {
  fetchMock.getOnce('/api/severe-weather-alerts', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Alerts')); });

  expect(fetchMock.called('/api/severe-weather-alerts')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve severe weather alerts/)).toBeInTheDocument();
}, 10000);

test('fetchAirQualityAlerts successfully retrieves air quality alerts (from fetchAirQualityAlerts_fetchCurrentHumidity)', async () => {
  fetchMock.getOnce('/api/air-quality-alerts', {
    status: 200,
    body: [{ id: 1, alert: 'Air Quality Alert' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Air Quality Alerts')); });

  expect(fetchMock.called('/api/air-quality-alerts')).toBeTruthy();
  expect(screen.getByText(/Air Quality Alert/)).toBeInTheDocument();
}, 10000);

test('fetchAirQualityAlerts fails to retrieve air quality alerts (from fetchAirQualityAlerts_fetchCurrentHumidity)', async () => {
  fetchMock.getOnce('/api/air-quality-alerts', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Air Quality Alerts')); });

  expect(fetchMock.called('/api/air-quality-alerts')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve air quality alerts/)).toBeInTheDocument();
}, 10000);

test('Successfully retrieves the current humidity for a given location (from fetchAirQualityAlerts_fetchCurrentHumidity)', async () => {
  fetchMock.get('/api/current-humidity?location=NYC', { humidity: 65 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Humidity')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('65%')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current humidity if the API returns an error (from fetchAirQualityAlerts_fetchCurrentHumidity)', async () => {
  fetchMock.get('/api/current-humidity?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Humidity')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching humidity')).toBeInTheDocument();
}, 10000);

