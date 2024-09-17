import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentCloudCover_fetchWeatherByRegion';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully retrieves the current cloud cover percentage for a given location', async () => {
  fetchMock.get('/api/current-clouds?location=NYC', { cloudCover: 45 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Cloud Cover')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('45%')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current cloud cover percentage if the API returns an error', async () => {
  fetchMock.get('/api/current-clouds?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Cloud Cover')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching cloud cover')).toBeInTheDocument();
}, 10000);

test('Fetch weather by region succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { region: 'Midwest', temperature: 25 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('region-input'), { target: { value: 'Midwest' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 25')).toBeInTheDocument();
}, 10000);

test('Fetch weather by region fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('region-input'), { target: { value: 'InvalidRegion' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Region not found')).toBeInTheDocument();
}, 10000);