import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editActivity_trackWaterIntake_provideSuggestionsForGoals_trackProgressInChallenges';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can edit an existing fitness activity successfully. (from editActivity_trackWaterIntake)', async () => {
  fetchMock.put('/api/editActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Updated Running' } });
    fireEvent.click(screen.getByTestId('submit-edit'));
  });

  expect(fetchMock.called('/api/editActivity')).toBeTruthy();
  expect(screen.getByText('Activity updated successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when editing a fitness activity fails. (from editActivity_trackWaterIntake)', async () => {
  fetchMock.put('/api/editActivity', { status: 500, body: { error: 'Failed to edit activity' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-name'), { target: { value: 'Updated Running' } });
    fireEvent.click(screen.getByTestId('submit-edit'));
  });

  expect(fetchMock.called('/api/editActivity')).toBeTruthy();
  expect(screen.getByText('Failed to edit activity')).toBeInTheDocument();
}, 10000);

test('tracks water intake successfully and displays progress (from editActivity_trackWaterIntake)', async () => {
  fetchMock.get('/api/track-water-intake', { status: 200, body: { progress: 80 } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Daily water intake progress: 80%')).toBeInTheDocument();
}, 10000);

test('fails to track water intake and displays an error message (from editActivity_trackWaterIntake)', async () => {
  fetchMock.get('/api/track-water-intake', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to track water intake.')).toBeInTheDocument();
}, 10000);

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

