import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchWeatherForSpecificLandmark';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Fetch weather for specific landmark succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { landmark: 'Eiffel Tower', temperature: 18 } });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('landmark-input'), { target: { value: 'Eiffel Tower' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 18')).toBeInTheDocument();
}, 10000);

test('Fetch weather for specific landmark fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('landmark-input'), { target: { value: 'InvalidLandmark' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Landmark not found')).toBeInTheDocument();
}, 10000);