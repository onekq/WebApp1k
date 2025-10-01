import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchTornadoWarnings_fetchWeatherForCustomLocations_fetchWeekendForecast';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('fetchTornadoWarnings successfully retrieves tornado warnings', async () => {
  fetchMock.getOnce('/api/tornado-warnings', {
    status: 200,
    body: [{ id: 1, warning: 'Tornado Warning' }],
  });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Tornado Warnings')); });

  expect(fetchMock.called('/api/tornado-warnings')).toBeTruthy();
  expect(screen.getByText(/Tornado Warning/)).toBeInTheDocument();
}, 10000);

test('fetchTornadoWarnings fails to retrieve tornado warnings', async () => {
  fetchMock.getOnce('/api/tornado-warnings', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Tornado Warnings')); });

  expect(fetchMock.called('/api/tornado-warnings')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve tornado warnings/)).toBeInTheDocument();
}, 10000);

test('Fetch weather for custom locations succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { customLocation: 'Mars', temperature: -60 } });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('custom-location-input'), { target: { value: 'Mars' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Mars: Temperature: -60')).toBeInTheDocument();
}, 10000);

test('Fetch weather for custom locations fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('custom-location-input'), { target: { value: 'InvalidLocation' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Custom location not found')).toBeInTheDocument();
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
