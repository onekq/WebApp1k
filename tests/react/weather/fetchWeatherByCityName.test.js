import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchWeatherByCityName';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Fetch weather by city name succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { city: 'New York', temperature: 20 } });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 20')).toBeInTheDocument();
}, 10000);

test('Fetch weather by city name fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('city-input'), { target: { value: 'InvalidCity' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('City not found')).toBeInTheDocument();
}, 10000);

