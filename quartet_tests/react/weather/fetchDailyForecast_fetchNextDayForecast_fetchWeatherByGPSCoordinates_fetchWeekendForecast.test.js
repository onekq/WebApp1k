import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchDailyForecast_fetchNextDayForecast_fetchWeatherByGPSCoordinates_fetchWeekendForecast';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('FetchDailyForecast - retrieves daily forecast successfully (from fetchDailyForecast_fetchNextDayForecast)', async () => {
  fetchMock.get('/api/daily-forecast', {
    body: { forecast: 'Partly Cloudy' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Daily Forecast'));
  });

  expect(fetchMock.calls('/api/daily-forecast').length).toBe(1);
  expect(screen.getByText('Partly Cloudy')).toBeInTheDocument();
}, 10000);

test('FetchDailyForecast - fails to retrieve daily forecast (from fetchDailyForecast_fetchNextDayForecast)', async () => {
  fetchMock.get('/api/daily-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Daily Forecast'));
  });

  expect(fetchMock.calls('/api/daily-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);

test('FetchNextDayForecast - retrieves next-day forecast successfully (from fetchDailyForecast_fetchNextDayForecast)', async () => {
  fetchMock.get('/api/next-day-forecast', {
    body: { forecast: 'Next Day: Cloudy' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Next Day Forecast'));
  });

  expect(fetchMock.calls('/api/next-day-forecast').length).toBe(1);
  expect(screen.getByText('Next Day: Cloudy')).toBeInTheDocument();
}, 10000);

test('FetchNextDayForecast - fails to retrieve next-day forecast (from fetchDailyForecast_fetchNextDayForecast)', async () => {
  fetchMock.get('/api/next-day-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Next Day Forecast'));
  });

  expect(fetchMock.calls('/api/next-day-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);

test('Fetch weather by GPS coordinates succeeds. (from fetchWeatherByGPSCoordinates_fetchWeekendForecast)', async () => {
  fetchMock.post('/api/weather', { data: { lat: '40.7128', lon: '-74.0060', temperature: 22 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('lat-input'), { target: { value: '40.7128' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('lon-input'), { target: { value: '-74.0060' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 22')).toBeInTheDocument();
}, 10000);

test('Fetch weather by GPS coordinates fails. (from fetchWeatherByGPSCoordinates_fetchWeekendForecast)', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('lat-input'), { target: { value: 'InvalidLat' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('lon-input'), { target: { value: 'InvalidLon' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Coordinates not found')).toBeInTheDocument();
}, 10000);

test('FetchWeekendForecast - retrieves weekend forecast successfully (from fetchWeatherByGPSCoordinates_fetchWeekendForecast)', async () => {
  fetchMock.get('/api/weekend-forecast', {
    body: { forecast: 'Weekend: Sunny' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Weekend Forecast'));
  });

  expect(fetchMock.calls('/api/weekend-forecast').length).toBe(1);
  expect(screen.getByText('Weekend: Sunny')).toBeInTheDocument();
}, 10000);

test('FetchWeekendForecast - fails to retrieve weekend forecast (from fetchWeatherByGPSCoordinates_fetchWeekendForecast)', async () => {
  fetchMock.get('/api/weekend-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Weekend Forecast'));
  });

  expect(fetchMock.calls('/api/weekend-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);

