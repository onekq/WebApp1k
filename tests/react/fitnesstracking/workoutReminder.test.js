import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SetWorkoutReminder from './workoutReminder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully set a reminder for workouts', async () => {
  fetchMock.post('/api/reminders/workouts', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><SetWorkoutReminder /></MemoryRouter>);
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
    render(<MemoryRouter><SetWorkoutReminder /></MemoryRouter>);
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

