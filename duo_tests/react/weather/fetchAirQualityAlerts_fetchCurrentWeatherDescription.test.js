import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchAirQualityAlerts_fetchCurrentWeatherDescription';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('fetchAirQualityAlerts successfully retrieves air quality alerts', async () => {
  fetchMock.getOnce('/api/air-quality-alerts', {
    status: 200,
    body: [{ id: 1, alert: 'Air Quality Alert' }],
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Air Quality Alerts')); });

  expect(fetchMock.called('/api/air-quality-alerts')).toBeTruthy();
  expect(screen.getByText(/Air Quality Alert/)).toBeInTheDocument();
}, 10000);

test('fetchAirQualityAlerts fails to retrieve air quality alerts', async () => {
  fetchMock.getOnce('/api/air-quality-alerts', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Air Quality Alerts')); });

  expect(fetchMock.called('/api/air-quality-alerts')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve air quality alerts/)).toBeInTheDocument();
}, 10000);

test('Successfully retrieves a description of current weather conditions', async () => {
  fetchMock.get('/api/current-description?location=NYC', { description: 'Sunny' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather Description')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sunny')).toBeInTheDocument();
}, 10000);

test('Fails to retrieve a description of current weather conditions if the API returns an error', async () => {
  fetchMock.get('/api/current-description?location=NYC', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Location Input'), { target: { value: 'NYC' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Weather Description')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error fetching weather description')).toBeInTheDocument();
}, 10000);