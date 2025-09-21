import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentCloudCover_fetchCurrentVisibility_fetchNextDayForecast';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully retrieves the current cloud cover percentage for a given location', async () => {
  fetchMock.get('/api/current-clouds?location=NYC', { cloudCover: 45 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Cloud Cover')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('45%')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current cloud cover percentage if the API returns an error', async () => {
  fetchMock.get('/api/current-clouds?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Cloud Cover')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching cloud cover')).toBeInTheDocument();
}, 10000);

test('Successfully retrieves the current visibility distance for a given location', async () => {
  fetchMock.get('/api/current-visibility?location=NYC', { visibility: 10 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Visibility')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('10 miles')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current visibility distance if the API returns an error', async () => {
  fetchMock.get('/api/current-visibility?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Visibility')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching visibility')).toBeInTheDocument();
}, 10000);

test('FetchNextDayForecast - retrieves next-day forecast successfully', async () => {
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

test('FetchNextDayForecast - fails to retrieve next-day forecast', async () => {
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
