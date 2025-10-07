import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './detailedStatistics_trackWorkoutIntensity_evaluateCustomWorkoutPlans_predictFutureAchievements';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can view detailed statistics of a specific fitness activity successfully. (from detailedStatistics_trackWorkoutIntensity)', async () => {
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

test('User sees an error message when viewing detailed statistics fails. (from detailedStatistics_trackWorkoutIntensity)', async () => {
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

test('tracks workout intensity successfully and displays intensity (from detailedStatistics_trackWorkoutIntensity)', async () => {
  fetchMock.get('/api/track-intensity', { status: 200, body: { intensity: 'Moderate' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Workout intensity: Moderate')).toBeInTheDocument();
}, 10000);

test('fails to track workout intensity and displays an error message (from detailedStatistics_trackWorkoutIntensity)', async () => {
  fetchMock.get('/api/track-intensity', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track workout intensity.')).toBeInTheDocument();
}, 10000);

test('evaluates custom workout plans successfully and displays evaluation (from evaluateCustomWorkoutPlans_predictFutureAchievements)', async () => {
  fetchMock.get('/api/evaluate-workout', { status: 200, body: { effectiveness: 'High' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Workout plan effectiveness: High')).toBeInTheDocument();
}, 10000);

test('fails to evaluate custom workout plans and displays an error message (from evaluateCustomWorkoutPlans_predictFutureAchievements)', async () => {
  fetchMock.get('/api/evaluate-workout', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to evaluate workout plan.')).toBeInTheDocument();
}, 10000);

test('System predicts future fitness achievements based on current progress successfully. (from evaluateCustomWorkoutPlans_predictFutureAchievements)', async () => {
  fetchMock.get('/api/predict-achievements', { prediction: '5K run next month' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('predict-achievements')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/5K run next month/)).toBeInTheDocument();
}, 10000);

test('System fails to predict future fitness achievements based on current progress. (from evaluateCustomWorkoutPlans_predictFutureAchievements)', async () => {
  fetchMock.get('/api/predict-achievements', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('predict-achievements')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error predicting achievements/)).toBeInTheDocument();
}, 10000);

