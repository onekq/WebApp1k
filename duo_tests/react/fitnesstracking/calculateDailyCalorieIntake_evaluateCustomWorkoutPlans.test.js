import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateDailyCalorieIntake_evaluateCustomWorkoutPlans';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculates daily calorie intake successfully and displays calories', async () => {
  fetchMock.get('/api/calculate-calories', { status: 200, body: { calories: 2000 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total calories consumed: 2000')).toBeInTheDocument();
}, 10000);

test('fails to calculate daily calorie intake and displays an error message', async () => {
  fetchMock.get('/api/calculate-calories', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to calculate daily calorie intake.')).toBeInTheDocument();
}, 10000);

test('evaluates custom workout plans successfully and displays evaluation', async () => {
  fetchMock.get('/api/evaluate-workout', { status: 200, body: { effectiveness: 'High' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Workout plan effectiveness: High')).toBeInTheDocument();
}, 10000);

test('fails to evaluate custom workout plans and displays an error message', async () => {
  fetchMock.get('/api/evaluate-workout', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to evaluate workout plan.')).toBeInTheDocument();
}, 10000);