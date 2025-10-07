import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setDailyGoal_workoutReminder_detailedStatistics_logStrengthTraining';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully set a daily fitness goal (from setDailyGoal_workoutReminder)', async () => {
  fetchMock.post('/api/goals/daily', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/daily goal/i), { target: { value: 10000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/goal set successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when setting a daily fitness goal fails (from setDailyGoal_workoutReminder)', async () => {
  fetchMock.post('/api/goals/daily', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/daily goal/i), { target: { value: 10000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to set goal/i)).toBeInTheDocument();
}, 10000);

test('should successfully set a reminder for workouts (from setDailyGoal_workoutReminder)', async () => {
  fetchMock.post('/api/reminders/workouts', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/reminder/i), { target: { value: '07:00 AM' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/reminder set successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when setting a reminder for workouts fails (from setDailyGoal_workoutReminder)', async () => {
  fetchMock.post('/api/reminders/workouts', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/reminder/i), { target: { value: '07:00 AM' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set reminder/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to set reminder/i)).toBeInTheDocument();
}, 10000);

test('User can view detailed statistics of a specific fitness activity successfully. (from detailedStatistics_logStrengthTraining)', async () => {
  fetchMock.get('/api/detailedStatistics', { status: 200, body: { data: { calories: 500 } } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-detailed-statistics'));
  });

  expect(fetchMock.called('/api/detailedStatistics')).toBeTruthy();
  expect(screen.getByText('500 calories')).toBeInTheDocument();
}, 10000);

test('User sees an error message when viewing detailed statistics fails. (from detailedStatistics_logStrengthTraining)', async () => {
  fetchMock.get('/api/detailedStatistics', { status: 500, body: { error: 'Failed to fetch statistics' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-detailed-statistics'));
  });

  expect(fetchMock.called('/api/detailedStatistics')).toBeTruthy();
  expect(screen.getByText('Failed to fetch statistics')).toBeInTheDocument();
}, 10000);

test('User can log a strength training activity successfully. (from detailedStatistics_logStrengthTraining)', async () => {
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

test('User sees an error message when logging a strength training activity fails. (from detailedStatistics_logStrengthTraining)', async () => {
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

