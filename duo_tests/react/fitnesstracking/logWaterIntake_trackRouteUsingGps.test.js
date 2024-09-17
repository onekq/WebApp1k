import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './logWaterIntake_trackRouteUsingGps';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('logs water intake successfully and displays intake in the list', async () => {
  fetchMock.post('/api/log-water-intake', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter water intake'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Water')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Water logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log water intake and displays an error message', async () => {
  fetchMock.post('/api/log-water-intake', { status: 400, body: { error: 'Invalid intake' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter water intake'), { target: { value: '-100' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Water')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log water intake.')).toBeInTheDocument();
}, 10000);

test('should track route using GPS successfully.', async () => {
  fetchMock.post('/api/gps/track', { status: 200, body: { route: 'sample-route-data' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-route-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/gps/track')).toBe(true);
  expect(screen.getByText('Route tracked successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to track route using GPS.', async () => {
  fetchMock.post('/api/gps/track', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-route-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/gps/track')).toBe(true);
  expect(screen.getByText('Failed to track route.')).toBeInTheDocument();
}, 10000);