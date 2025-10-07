import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchWeatherByGPSCoordinates_fetchWeekendForecast_fetchCurrentVisibility_fetchTsunamiWarnings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

