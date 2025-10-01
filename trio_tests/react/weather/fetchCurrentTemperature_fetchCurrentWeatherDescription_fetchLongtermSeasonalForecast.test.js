import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentTemperature_fetchCurrentWeatherDescription_fetchLongtermSeasonalForecast';

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

test('Successfully retrieves a description of current weather conditions', async () => {
  fetchMock.get('/api/current-description?location=NYC', { description: 'Sunny' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather Description')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sunny')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve a description of current weather conditions if the API returns an error', async () => {
  fetchMock.get('/api/current-description?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather Description')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching weather description')).toBeInTheDocument();
}, 10000);

test('FetchLongtermSeasonalForecast - retrieves long-term seasonal forecast successfully', async () => {
  fetchMock.get('/api/seasonal-forecast', {
    body: { forecast: 'Cold Season' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Seasonal Forecast'));
  });

  expect(fetchMock.calls('/api/seasonal-forecast').length).toBe(1);
  expect(screen.getByText('Cold Season')).toBeInTheDocument();
}, 10000);

test('FetchLongtermSeasonalForecast - fails to retrieve long-term seasonal forecast', async () => {
  fetchMock.get('/api/seasonal-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Seasonal Forecast'));
  });

  expect(fetchMock.calls('/api/seasonal-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);
