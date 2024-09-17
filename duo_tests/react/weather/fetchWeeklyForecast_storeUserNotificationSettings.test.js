import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './fetchWeeklyForecast_storeUserNotificationSettings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('FetchWeeklyForecast - retrieves weekly forecast successfully', async () => {
  fetchMock.get('/api/weekly-forecast', {
    body: { forecast: 'Rainy Week' },
    status: 200
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Weekly Forecast'));
  });

  expect(fetchMock.calls('/api/weekly-forecast').length).toBe(1);
  expect(screen.getByText('Rainy Week')).toBeInTheDocument();
}, 10000);

test('FetchWeeklyForecast - fails to retrieve weekly forecast', async () => {
  fetchMock.get('/api/weekly-forecast', {
    body: { error: 'Failed to fetch data' },
    status: 500
  });

  await act(async () => { 
    render(<MemoryRouter><App /></MemoryRouter>); 
  });
  await act(async () => { 
    fireEvent.click(screen.getByText('Get Weekly Forecast'));
  });

  expect(fetchMock.calls('/api/weekly-forecast').length).toBe(1);
  expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
}, 10000);

test('correctly stores user notification settings', async () => {
  fetchMock.post('/preferences/notifications', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notifications-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/preference saved/i)).toBeInTheDocument();
}, 10000);

test('displays error when storing user notification settings fails', async () => {
  fetchMock.post('/preferences/notifications', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notifications-checkbox'), { target: { checked: true } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to save preference/i)).toBeInTheDocument();
}, 10000);