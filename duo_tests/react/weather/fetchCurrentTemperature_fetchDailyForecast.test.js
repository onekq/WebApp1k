import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentTemperature_fetchDailyForecast';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully retrieves the current temperature for a given location', async () => {
  fetchMock.get('/api/current-temperature?location=NYC', { temperature: 75 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Temperature')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('75�F')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current temperature if the API returns an error', async () => {
  fetchMock.get('/api/current-temperature?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Temperature')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching temperature')).toBeInTheDocument();
}, 10000);

test('FetchDailyForecast - retrieves daily forecast successfully', async () => {
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

test('FetchDailyForecast - fails to retrieve daily forecast', async () => {
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