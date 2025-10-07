import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './provideSuggestionsForGoals_summarizeStrengthTrainingProgress_evaluateCustomWorkoutPlans_predictFutureAchievements';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('provides suggestions for goals successfully and displays suggestions (from provideSuggestionsForGoals_summarizeStrengthTrainingProgress)', async () => {
  fetchMock.get('/api/provide-suggestions', { status: 200, body: { suggestions: 'Increase protein intake' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Suggestion: Increase protein intake')).toBeInTheDocument();
}, 10000);

test('fails to provide suggestions for goals and displays an error message (from provideSuggestionsForGoals_summarizeStrengthTrainingProgress)', async () => {
  fetchMock.get('/api/provide-suggestions', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to provide suggestions.')).toBeInTheDocument();
}, 10000);

test('should summarize strength training progress successfully. (from provideSuggestionsForGoals_summarizeStrengthTrainingProgress)', async () => {
  fetchMock.get('/api/strength/progress', { status: 200, body: { progress: 'increased' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('summarize-progress-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/strength/progress')).toBe(true);
  expect(screen.getByText('Progress: increased')).toBeInTheDocument();
}, 10000);

test('should fail to summarize strength training progress. (from provideSuggestionsForGoals_summarizeStrengthTrainingProgress)', async () => {
  fetchMock.get('/api/strength/progress', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('summarize-progress-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/strength/progress')).toBe(true);
  expect(screen.getByText('Failed to fetch progress.')).toBeInTheDocument();
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

