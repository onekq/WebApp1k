import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchWeatherByZIPCode_fetchWeatherForUsersCurrentLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Fetch weather by ZIP code succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { zip: '10001', temperature: 15 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('zip-input'), { target: { value: '10001' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 15')).toBeInTheDocument();
}, 10000);

test('Fetch weather by ZIP code fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('zip-input'), { target: { value: '00000' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('ZIP code not found')).toBeInTheDocument();
}, 10000);

test('Fetch weather for user\'s current location succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { location: 'Current Location', temperature: 30 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Current Location')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 30')).toBeInTheDocument();
}, 10000);

test('Fetch weather for user\'s current location fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather for Current Location')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Current location not found')).toBeInTheDocument();
}, 10000);