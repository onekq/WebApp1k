import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchSevereThunderstormWarnings_fetchWeatherByRegion_fetchWeekendForecast';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('fetchSevereThunderstormWarnings successfully retrieves severe thunderstorm warnings', async () => {
  fetchMock.getOnce('/api/severe-thunderstorm-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Severe Thunderstorm Warning' }],
  });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Severe Thunderstorm Warnings')); });

  expect(fetchMock.called('/api/severe-thunderstorm-warnings')).toBeTruthy();
  expect(screen.getByText(/Severe Thunderstorm Warning/)).toBeInTheDocument();
}, 10000);

test('fetchSevereThunderstormWarnings fails to retrieve severe thunderstorm warnings', async () => {
  fetchMock.getOnce('/api/severe-thunderstorm-warnings', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Severe Thunderstorm Warnings')); });

  expect(fetchMock.called('/api/severe-thunderstorm-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve severe thunderstorm warnings/)).toBeInTheDocument();
}, 10000);

test('Fetch weather by region succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { region: 'Midwest', temperature: 25 } });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('region-input'), { target: { value: 'Midwest' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 25')).toBeInTheDocument();
}, 10000);

test('Fetch weather by region fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('region-input'), { target: { value: 'InvalidRegion' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Region not found')).toBeInTheDocument();
}, 10000);

test('FetchWeekendForecast - retrieves weekend forecast successfully', async () => {
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

test('FetchWeekendForecast - fails to retrieve weekend forecast', async () => {
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
