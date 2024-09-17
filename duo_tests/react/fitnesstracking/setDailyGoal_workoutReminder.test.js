import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setDailyGoal_workoutReminder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully set a daily fitness goal', async () => {
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

test('should show error when setting a daily fitness goal fails', async () => {
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

test('should successfully set a reminder for workouts', async () => {
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

test('should show error when setting a reminder for workouts fails', async () => {
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