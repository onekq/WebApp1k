import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './connectWearableDevice_logOutdoorActivity_calculateDailyCalorieIntake_evaluateCustomWorkoutPlans';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should connect to a wearable device successfully. (from connectWearableDevice_logOutdoorActivity)', async () => {
  fetchMock.post('/api/device/connect', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('device-input'), { target: { value: 'device-name' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('connect-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/device/connect')).toBe(true);
  expect(screen.getByText('Device connected successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to connect to a wearable device. (from connectWearableDevice_logOutdoorActivity)', async () => {
  fetchMock.post('/api/device/connect', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('device-input'), { target: { value: 'device-name' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('connect-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/device/connect')).toBe(true);
  expect(screen.getByText('Failed to connect device.')).toBeInTheDocument();
}, 10000);

test('User can log an outdoor activity and track the route using GPS successfully. (from connectWearableDevice_logOutdoorActivity)', async () => {
  fetchMock.post('/api/logOutdoorActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('outdoor-activity-type'), { target: { value: 'Hiking' } });
    fireEvent.click(screen.getByTestId('track-activity'));
  });

  expect(fetchMock.called('/api/logOutdoorActivity')).toBeTruthy();
  expect(screen.getByText('Outdoor activity tracked successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when logging an outdoor activity fails. (from connectWearableDevice_logOutdoorActivity)', async () => {
  fetchMock.post('/api/logOutdoorActivity', { status: 500, body: { error: 'Failed to track activity' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('outdoor-activity-type'), { target: { value: 'Hiking' } });
    fireEvent.click(screen.getByTestId('track-activity'));
  });

  expect(fetchMock.called('/api/logOutdoorActivity')).toBeTruthy();
  expect(screen.getByText('Failed to track activity')).toBeInTheDocument();
}, 10000);

test('calculates daily calorie intake successfully and displays calories (from calculateDailyCalorieIntake_evaluateCustomWorkoutPlans)', async () => {
  fetchMock.get('/api/calculate-calories', { status: 200, body: { calories: 2000 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total calories consumed: 2000')).toBeInTheDocument();
}, 10000);

test('fails to calculate daily calorie intake and displays an error message (from calculateDailyCalorieIntake_evaluateCustomWorkoutPlans)', async () => {
  fetchMock.get('/api/calculate-calories', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to calculate daily calorie intake.')).toBeInTheDocument();
}, 10000);

test('evaluates custom workout plans successfully and displays evaluation (from calculateDailyCalorieIntake_evaluateCustomWorkoutPlans)', async () => {
  fetchMock.get('/api/evaluate-workout', { status: 200, body: { effectiveness: 'High' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Workout plan effectiveness: High')).toBeInTheDocument();
}, 10000);

test('fails to evaluate custom workout plans and displays an error message (from calculateDailyCalorieIntake_evaluateCustomWorkoutPlans)', async () => {
  fetchMock.get('/api/evaluate-workout', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to evaluate workout plan.')).toBeInTheDocument();
}, 10000);

