import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteActivity_trackMoodChanges_evaluateCustomWorkoutPlans_predictFutureAchievements';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can delete a fitness activity successfully. (from deleteActivity_trackMoodChanges)', async () => {
  fetchMock.delete('/api/deleteActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-activity'));
  });

  expect(fetchMock.called('/api/deleteActivity')).toBeTruthy();
  expect(screen.getByText('Activity deleted successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when deleting a fitness activity fails. (from deleteActivity_trackMoodChanges)', async () => {
  fetchMock.delete('/api/deleteActivity', { status: 500, body: { error: 'Failed to delete activity' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-activity'));
  });

  expect(fetchMock.called('/api/deleteActivity')).toBeTruthy();
  expect(screen.getByText('Failed to delete activity')).toBeInTheDocument();
}, 10000);

test('System tracks mood changes over time related to workout intensity successfully. (from deleteActivity_trackMoodChanges)', async () => {
  fetchMock.get('/api/mood-changes', { data: 'Positive trend' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-mood')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Positive trend/)).toBeInTheDocument();
}, 10000);

test('System fails to track mood changes over time related to workout intensity. (from deleteActivity_trackMoodChanges)', async () => {
  fetchMock.get('/api/mood-changes', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-mood')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching mood changes/)).toBeInTheDocument();
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

