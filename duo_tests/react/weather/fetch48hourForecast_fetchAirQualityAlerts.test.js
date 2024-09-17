import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetch48hourForecast_fetchAirQualityAlerts';

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