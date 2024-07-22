import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import WeatherApp from './fetchWildfireAlerts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('fetchWildfireAlerts successfully retrieves wildfire alerts', async () => {
  fetchMock.getOnce('/api/wildfire-alerts', {
    status: 200,
    body: [{ id: 1, alert: 'Wildfire Alert' }],
  });

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Wildfire Alerts')); });

  expect(fetchMock.called('/api/wildfire-alerts')).toBeTruthy();
  expect(screen.getByText(/Wildfire Alert/)).toBeInTheDocument();
}, 10000);

test('fetchWildfireAlerts fails to retrieve wildfire alerts', async () => {
  fetchMock.getOnce('/api/wildfire-alerts', 404);

  await act(async () => { render(<MemoryRouter><WeatherApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Fetch Wildfire Alerts')); });

  expect(fetchMock.called('/api/wildfire-alerts')).toBeTruthy();
  expect(screen.getByText(/Failed to retrieve wildfire alerts/)).toBeInTheDocument();
}, 10000);