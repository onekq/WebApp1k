import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editDailyGoal_logSleepHours_workoutReminder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should successfully edit a daily fitness goal', async () => {
  fetchMock.put('/api/goals/daily/123', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App goalId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/daily goal/i), { target: { value: 12000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/edit goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/goal edited successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when editing a daily fitness goal fails', async () => {
  fetchMock.put('/api/goals/daily/123', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App goalId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/daily goal/i), { target: { value: 12000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/edit goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to edit goal/i)).toBeInTheDocument();
}, 10000);

test('logs sleep hours successfully and displays hours in the list', async () => {
  fetchMock.post('/api/log-sleep', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter sleep hours'), { target: { value: '8' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Sleep')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sleep hours logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log sleep hours and displays an error message', async () => {
  fetchMock.post('/api/log-sleep', { status: 400, body: { error: 'Invalid hours' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter sleep hours'), { target: { value: '-5' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Sleep')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log sleep hours.')).toBeInTheDocument();
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
