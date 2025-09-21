import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateCyclingSpeed_weeklyAverageSleep_workoutReminder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should calculate cycling speed successfully.', async () => {
  fetchMock.post('/api/speed/calculate', { status: 200, body: { speed: '30 km/h' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('time-input'), { target: { value: '60' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('distance-input'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-speed-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/speed/calculate')).toBe(true);
  expect(screen.getByText('Speed: 30 km/h')).toBeInTheDocument();
}, 10000);

test('should fail to calculate cycling speed.', async () => {
  fetchMock.post('/api/speed/calculate', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('time-input'), { target: { value: '60' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('distance-input'), { target: { value: '30' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-speed-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/speed/calculate')).toBe(true);
  expect(screen.getByText('Failed to calculate speed.')).toBeInTheDocument();
}, 10000);

test('System calculates weekly average sleep hours successfully.', async () => {
  fetchMock.get('/api/average-sleep', { hours: 7 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-sleep')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/7 hours/)).toBeInTheDocument();
}, 10000);

test('System fails to calculate weekly average sleep hours.', async () => {
  fetchMock.get('/api/average-sleep', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-sleep')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching sleep hours/)).toBeInTheDocument();
}, 10000);

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
