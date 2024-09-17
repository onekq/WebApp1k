import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetch48hourForecast_fetchWeatherForUsersCurrentLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Fetch48hourForecast - retrieves 48-hour forecast successfully', async () => {
  fetchMock.get('/api/48-hour-forecast', {
    body: { forecast: '48-Hour: Stormy' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get 48-Hour Forecast'));
  });

  expect(fetchMock.calls('/api/48-hour-forecast').length).toBe(1);
  expect(screen.getByText('48-Hour: Stormy')).toBeInTheDocument();
}, 10000);

test('Fetch48hourForecast - fails to retrieve 48-hour forecast', async () => {
  fetchMock.get('/api/48-hour-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get 48-Hour Forecast'));
  });

  expect(fetchMock.calls('/api/48-hour-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);

test('Fetch weather for user\'s current location succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { location: 'Current Location', temperature: 30 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Current Location')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 30')).toBeInTheDocument();
}, 10000);

test('Fetch weather for user\'s current location fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Current Location')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Current location not found')).toBeInTheDocument();
}, 10000);