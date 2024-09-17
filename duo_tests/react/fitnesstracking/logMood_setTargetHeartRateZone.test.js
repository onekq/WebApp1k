import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './logMood_setTargetHeartRateZone';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can log their mood after workouts successfully.', async () => {
  fetchMock.post('/api/logMood', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('mood'), { target: { value: 'Happy' } });
    fireEvent.click(screen.getByTestId('submit-mood'));
  });

  expect(fetchMock.called('/api/logMood')).toBeTruthy();
  expect(screen.getByText('Mood logged successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when logging their mood fails.', async () => {
  fetchMock.post('/api/logMood', { status: 500, body: { error: 'Failed to log mood' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('mood'), { target: { value: 'Happy' } });
    fireEvent.click(screen.getByTestId('submit-mood'));
  });

  expect(fetchMock.called('/api/logMood')).toBeTruthy();
  expect(screen.getByText('Failed to log mood')).toBeInTheDocument();
}, 10000);

test('should successfully set a target heart rate zone', async () => {
  fetchMock.post('/api/goals/heart-rate', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/heart rate zone/i), { target: { value: '120-150' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set zone/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/zone set successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when setting a target heart rate zone fails', async () => {
  fetchMock.post('/api/goals/heart-rate', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/heart rate zone/i), { target: { value: '120-150' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set zone/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to set zone/i)).toBeInTheDocument();
}, 10000);