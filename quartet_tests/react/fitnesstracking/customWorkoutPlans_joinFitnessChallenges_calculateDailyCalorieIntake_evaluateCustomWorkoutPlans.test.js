import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customWorkoutPlans_joinFitnessChallenges_calculateDailyCalorieIntake_evaluateCustomWorkoutPlans';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully create a custom workout plan (from customWorkoutPlans_joinFitnessChallenges)', async () => {
  fetchMock.post('/api/workouts/custom', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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

test('should show error when creating a custom workout plan fails (from customWorkoutPlans_joinFitnessChallenges)', async () => {
  fetchMock.post('/api/workouts/custom', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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

test('should successfully join a fitness challenge (from customWorkoutPlans_joinFitnessChallenges)', async () => {
  fetchMock.post('/api/challenges/join/123', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App challengeId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/join challenge/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/joined successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when joining a fitness challenge fails (from customWorkoutPlans_joinFitnessChallenges)', async () => {
  fetchMock.post('/api/challenges/join/123', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App challengeId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/join challenge/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to join/i)).toBeInTheDocument();
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

