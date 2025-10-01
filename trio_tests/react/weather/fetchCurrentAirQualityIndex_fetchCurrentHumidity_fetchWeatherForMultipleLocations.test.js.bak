import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentAirQualityIndex_fetchCurrentHumidity_fetchWeatherForMultipleLocations';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully retrieves the current air quality index for a given location', async () => {
  fetchMock.get('/api/current-aqi?location=NYC', { aqi: 42 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get AQI')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('42')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current air quality index if the API returns an error', async () => {
  fetchMock.get('/api/current-aqi?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get AQI')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching AQI')).toBeInTheDocument();
}, 10000);

test('Successfully retrieves the current humidity for a given location', async () => {
  fetchMock.get('/api/current-humidity?location=NYC', { humidity: 65 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Humidity')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('65%')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current humidity if the API returns an error', async () => {
  fetchMock.get('/api/current-humidity?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Humidity')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching humidity')).toBeInTheDocument();
}, 10000);

test('Fetch weather for multiple locations succeeds.', async () => {
  fetchMock.post('/api/weather', { data: [{ location: 'New York', temperature: 20 }, { location: 'Los Angeles', temperature: 25 }] });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('locations-input'), { target: { value: 'New York, Los Angeles' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('New York: Temperature: 20')).toBeInTheDocument();
  expect(screen.getByText('Los Angeles: Temperature: 25')).toBeInTheDocument();
}, 10000);

test('Fetch weather for multiple locations fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('locations-input'), { target: { value: 'InvalidLocation1, InvalidLocation2' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Locations not found')).toBeInTheDocument();
}, 10000);
