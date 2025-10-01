import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchAirQualityAlerts_fetchMonthlyForecast_fetchWeatherForMultipleLocations';

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

test('FetchMonthlyForecast - retrieves monthly forecast successfully', async () => {
  fetchMock.get('/api/monthly-forecast', {
    body: { forecast: 'Warm Month' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Monthly Forecast'));
  });

  expect(fetchMock.calls('/api/monthly-forecast').length).toBe(1);
  expect(screen.getByText('Warm Month')).toBeInTheDocument();
}, 10000);

test('FetchMonthlyForecast - fails to retrieve monthly forecast', async () => {
  fetchMock.get('/api/monthly-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Monthly Forecast'));
  });

  expect(fetchMock.calls('/api/monthly-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
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
