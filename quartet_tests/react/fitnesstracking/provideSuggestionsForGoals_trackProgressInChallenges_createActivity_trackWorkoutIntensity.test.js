import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './provideSuggestionsForGoals_trackProgressInChallenges_createActivity_trackWorkoutIntensity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('provides suggestions for goals successfully and displays suggestions (from provideSuggestionsForGoals_trackProgressInChallenges)', async () => {
  fetchMock.get('/api/provide-suggestions', { status: 200, body: { suggestions: 'Increase protein intake' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Suggestion: Increase protein intake')).toBeInTheDocument();
}, 10000);

test('fails to provide suggestions for goals and displays an error message (from provideSuggestionsForGoals_trackProgressInChallenges)', async () => {
  fetchMock.get('/api/provide-suggestions', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to provide suggestions.')).toBeInTheDocument();
}, 10000);

test('System tracks progress in fitness challenges successfully. (from provideSuggestionsForGoals_trackProgressInChallenges)', async () => {
  fetchMock.get('/api/progress-challenges', { progress: '50%' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-challenges')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/50%/)).toBeInTheDocument();
}, 10000);

test('System fails to track progress in fitness challenges. (from provideSuggestionsForGoals_trackProgressInChallenges)', async () => {
  fetchMock.get('/api/progress-challenges', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-challenges')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching challenges progress/)).toBeInTheDocument();
}, 10000);

test('User can create a new fitness activity successfully. (from createActivity_trackWorkoutIntensity)', async () => {
  fetchMock.post('/api/createActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Running' } });
    fireEvent.click(screen.getByTestId('submit-activity'));
  });

  expect(fetchMock.called('/api/createActivity')).toBeTruthy();
  expect(screen.getByText('Activity created successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when creating a new fitness activity fails. (from createActivity_trackWorkoutIntensity)', async () => {
  fetchMock.post('/api/createActivity', { status: 500, body: { error: 'Failed to create activity' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Running' } });
    fireEvent.click(screen.getByTestId('submit-activity'));
  });

  expect(fetchMock.called('/api/createActivity')).toBeTruthy();
  expect(screen.getByText('Failed to create activity')).toBeInTheDocument();
}, 10000);

test('tracks workout intensity successfully and displays intensity (from createActivity_trackWorkoutIntensity)', async () => {
  fetchMock.get('/api/track-intensity', { status: 200, body: { intensity: 'Moderate' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Workout intensity: Moderate')).toBeInTheDocument();
}, 10000);

test('fails to track workout intensity and displays an error message (from createActivity_trackWorkoutIntensity)', async () => {
  fetchMock.get('/api/track-intensity', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track workout intensity.')).toBeInTheDocument();
}, 10000);

