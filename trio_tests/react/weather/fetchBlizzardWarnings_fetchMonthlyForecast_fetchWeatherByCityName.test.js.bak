import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchBlizzardWarnings_fetchMonthlyForecast_fetchWeatherByCityName';

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

test('Fetch weather by city name succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { city: 'New York', temperature: 20 } });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 20')).toBeInTheDocument();
}, 10000);

test('Fetch weather by city name fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'InvalidCity' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('City not found')).toBeInTheDocument();
}, 10000);
