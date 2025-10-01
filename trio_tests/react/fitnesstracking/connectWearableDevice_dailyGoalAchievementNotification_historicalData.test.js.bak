import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './connectWearableDevice_dailyGoalAchievementNotification_historicalData';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should connect to a wearable device successfully.', async () => {
  fetchMock.post('/api/device/connect', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('device-input'), { target: { value: 'device-name' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('connect-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/device/connect')).toBe(true);
  expect(screen.getByText('Device connected successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to connect to a wearable device.', async () => {
  fetchMock.post('/api/device/connect', 500);
  
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('device-input'), { target: { value: 'device-name' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('connect-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/device/connect')).toBe(true);
  expect(screen.getByText('Failed to connect device.')).toBeInTheDocument();
}, 10000);

test('System sends a notification when a daily goal is achieved successfully.', async () => {
  fetchMock.post('/api/daily-goal', { status: 'Goal Achieved' });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-goal')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Goal Achieved/)).toBeInTheDocument();
}, 10000);

test('System fails to send a notification when a daily goal is achieved.', async () => {
  fetchMock.post('/api/daily-goal', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-goal')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error checking goal status/)).toBeInTheDocument();
}, 10000);

test('User can view historical data for past fitness activities successfully.', async () => {
  fetchMock.get('/api/historicalData', { status: 200, body: { data: [{ id: 1, name: 'Running' }] } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-historical-data'));
  });

  expect(fetchMock.called('/api/historicalData')).toBeTruthy();
  expect(screen.getByText('Running')).toBeInTheDocument();
}, 10000);

test('User sees an error message when viewing historical data fails.', async () => {
  fetchMock.get('/api/historicalData', { status: 500, body: { error: 'Failed to fetch historical data' } });

  await act(async () => {
    render(<MemoryRouter><FitnessApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-historical-data'));
  });

  expect(fetchMock.called('/api/historicalData')).toBeTruthy();
  expect(screen.getByText('Failed to fetch historical data')).toBeInTheDocument();
}, 10000);
