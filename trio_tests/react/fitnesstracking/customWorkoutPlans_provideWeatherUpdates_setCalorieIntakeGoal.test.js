import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customWorkoutPlans_provideWeatherUpdates_setCalorieIntakeGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should successfully create a custom workout plan', async () => {
  fetchMock.post('/api/workouts/custom', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><CreateWorkoutPlan /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/workout name/i), { target: { value: 'Morning Yoga' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/create plan/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/plan created successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when creating a custom workout plan fails', async () => {
  fetchMock.post('/api/workouts/custom', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><CreateWorkoutPlan /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/workout name/i), { target: { value: 'Morning Yoga' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/create plan/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to create plan/i)).toBeInTheDocument();
}, 10000);

test('should provide weather updates successfully.', async () => {
  fetchMock.get('/api/weather/updates', { status: 200, body: { weather: 'sunny' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('weather-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/weather/updates')).toBe(true);
  expect(screen.getByText('Weather: sunny')).toBeInTheDocument();
}, 10000);

test('should fail to provide weather updates.', async () => {
  fetchMock.get('/api/weather/updates', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('weather-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/weather/updates')).toBe(true);
  expect(screen.getByText('Failed to fetch weather updates.')).toBeInTheDocument();
}, 10000);

test('should successfully set a calorie intake goal', async () => {
  fetchMock.post('/api/goals/calories', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><SetCalorieGoal /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/calorie goal/i), { target: { value: 2000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/goal set successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when setting a calorie intake goal fails', async () => {
  fetchMock.post('/api/goals/calories', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><SetCalorieGoal /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/calorie goal/i), { target: { value: 2000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to set goal/i)).toBeInTheDocument();
}, 10000);
