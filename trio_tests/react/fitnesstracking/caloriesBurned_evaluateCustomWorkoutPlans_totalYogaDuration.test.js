import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './caloriesBurned_evaluateCustomWorkoutPlans_totalYogaDuration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('System calculates total calories burned in a week successfully.', async () => {
  fetchMock.get('/api/total-calories', { calories: 5000 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-calories')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/5000 calories/)).toBeInTheDocument();
}, 10000);

test('System fails to calculate total calories burned in a week.', async () => {
  fetchMock.get('/api/total-calories', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-calories')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching calories/)).toBeInTheDocument();
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

test('should calculate total yoga duration successfully.', async () => {
  fetchMock.get('/api/yoga/duration', { status: 200, body: { totalDuration: '10 hours' } });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-duration-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/yoga/duration')).toBe(true);
  expect(screen.getByText('Total Duration: 10 hours')).toBeInTheDocument();
}, 10000);

test('should fail to calculate total yoga duration.', async () => {
  fetchMock.get('/api/yoga/duration', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-duration-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/yoga/duration')).toBe(true);
  expect(screen.getByText('Failed to calculate total duration.')).toBeInTheDocument();
}, 10000);
