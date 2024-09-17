import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchWeatherByGPSCoordinates_storeUserThemePreference';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Fetch weather by GPS coordinates succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { lat: '40.7128', lon: '-74.0060', temperature: 22 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('lat-input'), { target: { value: '40.7128' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('lon-input'), { target: { value: '-74.0060' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 22')).toBeInTheDocument();
}, 10000);

test('Fetch weather by GPS coordinates fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('lat-input'), { target: { value: 'InvalidLat' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('lon-input'), { target: { value: 'InvalidLon' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Coordinates not found')).toBeInTheDocument();
}, 10000);

test('correctly stores user theme preference', async () => {
  fetchMock.post('/preferences/theme', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('theme-select'), { target: { value: 'dark' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user theme preference fails', async () => {
  fetchMock.post('/preferences/theme', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('theme-select'), { target: { value: 'dark' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);