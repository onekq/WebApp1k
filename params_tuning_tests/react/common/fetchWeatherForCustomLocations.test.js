import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchWeatherForCustomLocations';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Fetch weather for custom locations succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { customLocation: 'Mars', temperature: -60 } });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('custom-location-input'), { target: { value: 'Mars' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Mars: Temperature: -60')).toBeInTheDocument();
}, 10000);

test('Fetch weather for custom locations fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('custom-location-input'), { target: { value: 'InvalidLocation' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Custom location not found')).toBeInTheDocument();
}, 10000);

