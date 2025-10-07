import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './provideSuggestionsForGoals_summarizeStrengthTrainingProgress_caloriesBurned_logWeight';

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

test('System calculates total calories burned in a week successfully. (from caloriesBurned_logWeight)', async () => {
  fetchMock.get('/api/total-calories', { calories: 5000 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-calories')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/5000 calories/)).toBeInTheDocument();
}, 10000);

test('System fails to calculate total calories burned in a week. (from caloriesBurned_logWeight)', async () => {
  fetchMock.get('/api/total-calories', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-calories')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching calories/)).toBeInTheDocument();
}, 10000);

test('logs weight successfully and displays weight in the list (from caloriesBurned_logWeight)', async () => {
  fetchMock.post('/api/log-weight', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter weight'), { target: { value: '70' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Weight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Weight logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log weight and displays an error message (from caloriesBurned_logWeight)', async () => {
  fetchMock.post('/api/log-weight', { status: 400, body: { error: 'Invalid weight' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter weight'), { target: { value: '-1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Weight')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log weight.')).toBeInTheDocument();
}, 10000);

