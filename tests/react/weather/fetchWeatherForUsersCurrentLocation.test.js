import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchWeatherForUsersCurrentLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Fetch weather for user\'s current location succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { location: 'Current Location', temperature: 30 } });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Current Location')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 30')).toBeInTheDocument();
}, 10000);

test('Fetch weather for user\'s current location fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Current Location')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Current location not found')).toBeInTheDocument();
}, 10000);

