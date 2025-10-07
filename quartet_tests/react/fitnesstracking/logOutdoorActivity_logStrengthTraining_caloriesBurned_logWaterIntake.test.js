import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './logOutdoorActivity_logStrengthTraining_caloriesBurned_logWaterIntake';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can log an outdoor activity and track the route using GPS successfully. (from logOutdoorActivity_logStrengthTraining)', async () => {
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

test('User sees an error message when logging an outdoor activity fails. (from logOutdoorActivity_logStrengthTraining)', async () => {
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

test('User can log a strength training activity successfully. (from logOutdoorActivity_logStrengthTraining)', async () => {
  fetchMock.post('/api/logStrengthTraining', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('strength-training-type'), { target: { value: 'Weightlifting' } });
    fireEvent.click(screen.getByTestId('submit-strength-training'));
  });

  expect(fetchMock.called('/api/logStrengthTraining')).toBeTruthy();
  expect(screen.getByText('Strength training activity logged successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when logging a strength training activity fails. (from logOutdoorActivity_logStrengthTraining)', async () => {
  fetchMock.post('/api/logStrengthTraining', { status: 500, body: { error: 'Failed to log activity' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('strength-training-type'), { target: { value: 'Weightlifting' } });
    fireEvent.click(screen.getByTestId('submit-strength-training'));
  });

  expect(fetchMock.called('/api/logStrengthTraining')).toBeTruthy();
  expect(screen.getByText('Failed to log activity')).toBeInTheDocument();
}, 10000);

test('System calculates total calories burned in a week successfully. (from caloriesBurned_logWaterIntake)', async () => {
  fetchMock.get('/api/total-calories', { calories: 5000 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-calories')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/5000 calories/)).toBeInTheDocument();
}, 10000);

test('System fails to calculate total calories burned in a week. (from caloriesBurned_logWaterIntake)', async () => {
  fetchMock.get('/api/total-calories', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-calories')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching calories/)).toBeInTheDocument();
}, 10000);

test('logs water intake successfully and displays intake in the list (from caloriesBurned_logWaterIntake)', async () => {
  fetchMock.post('/api/log-water-intake', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter water intake'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Water')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Water logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log water intake and displays an error message (from caloriesBurned_logWaterIntake)', async () => {
  fetchMock.post('/api/log-water-intake', { status: 400, body: { error: 'Invalid intake' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter water intake'), { target: { value: '-100' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Water')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log water intake.')).toBeInTheDocument();
}, 10000);

