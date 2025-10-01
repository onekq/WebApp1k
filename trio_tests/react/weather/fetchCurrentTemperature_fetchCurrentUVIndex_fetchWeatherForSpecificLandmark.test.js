import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchCurrentTemperature_fetchCurrentUVIndex_fetchWeatherForSpecificLandmark';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully retrieves the current temperature for a given location', async () => {
  fetchMock.get('/api/current-temperature?location=NYC', { temperature: 75 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Temperature')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('75�F')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current temperature if the API returns an error', async () => {
  fetchMock.get('/api/current-temperature?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Temperature')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching temperature')).toBeInTheDocument();
}, 10000);

test('Successfully retrieves the current UV index for a given location', async () => {
  fetchMock.get('/api/current-uv?location=NYC', { uvIndex: 5 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get UV Index')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('5')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve the current UV index if the API returns an error', async () => {
  fetchMock.get('/api/current-uv?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get UV Index')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching UV index')).toBeInTheDocument();
}, 10000);

test('Fetch weather for specific landmark succeeds.', async () => {
  fetchMock.post('/api/weather', { data: { landmark: 'Eiffel Tower', temperature: 18 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('landmark-input'), { target: { value: 'Eiffel Tower' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Temperature: 18')).toBeInTheDocument();
}, 10000);

test('Fetch weather for specific landmark fails.', async () => {
  fetchMock.post('/api/weather', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('landmark-input'), { target: { value: 'InvalidLandmark' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Weather')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Landmark not found')).toBeInTheDocument();
}, 10000);
