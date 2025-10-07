import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentPressure_fetchWeatherForSpecificLandmark_fetchCurrentAirQualityIndex_fetchWeatherByRegion';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully retrieves the current atmospheric pressure for a given location (from fetchCurrentPressure_fetchWeatherForSpecificLandmark)', async () => {
  fetchMock.get('/api/current-pressure?location=NYC', { pressure: 1013 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Pressure')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('1013 hPa')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current atmospheric pressure if the API returns an error (from fetchCurrentPressure_fetchWeatherForSpecificLandmark)', async () => {
  fetchMock.get('/api/current-pressure?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Pressure')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching pressure')).toBeInTheDocument();
}, 10000);

test('Fetch weather for specific landmark succeeds. (from fetchCurrentPressure_fetchWeatherForSpecificLandmark)', async () => {
  fetchMock.post('/api/weather', { data: { landmark: 'Eiffel Tower', temperature: 18 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('landmark-input'), { target: { value: 'Eiffel Tower' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 18')).toBeInTheDocument();
}, 10000);

test('Fetch weather for specific landmark fails. (from fetchCurrentPressure_fetchWeatherForSpecificLandmark)', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('landmark-input'), { target: { value: 'InvalidLandmark' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Landmark not found')).toBeInTheDocument();
}, 10000);

test('Successfully retrieves the current air quality index for a given location (from fetchCurrentAirQualityIndex_fetchWeatherByRegion)', async () => {
  fetchMock.get('/api/current-aqi?location=NYC', { aqi: 42 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get AQI')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('42')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current air quality index if the API returns an error (from fetchCurrentAirQualityIndex_fetchWeatherByRegion)', async () => {
  fetchMock.get('/api/current-aqi?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get AQI')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching AQI')).toBeInTheDocument();
}, 10000);

test('Fetch weather by region succeeds. (from fetchCurrentAirQualityIndex_fetchWeatherByRegion)', async () => {
  fetchMock.post('/api/weather', { data: { region: 'Midwest', temperature: 25 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('region-input'), { target: { value: 'Midwest' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 25')).toBeInTheDocument();
}, 10000);

test('Fetch weather by region fails. (from fetchCurrentAirQualityIndex_fetchWeatherByRegion)', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('region-input'), { target: { value: 'InvalidRegion' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Region not found')).toBeInTheDocument();
}, 10000);

