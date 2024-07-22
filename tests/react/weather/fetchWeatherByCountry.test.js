import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchWeatherByCountry';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Fetch weather by country succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { country: 'USA', temperature: 28 } });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('country-input'), { target: { value: 'USA' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 28')).toBeInTheDocument();
}, 10000);

test('Fetch weather by country fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('country-input'), { target: { value: 'InvalidCountry' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Country not found')).toBeInTheDocument();
}, 10000);

