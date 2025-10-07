import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './categorizeActivity_compareCalorieIntakeToGoal_createActivity_provideSuggestionsForGoals';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can categorize a fitness activity successfully. (from categorizeActivity_compareCalorieIntakeToGoal)', async () => {
  fetchMock.post('/api/categorizeActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-category'), { target: { value: 'Cycling' } });
    fireEvent.click(screen.getByTestId('submit-category'));
  });

  expect(fetchMock.called('/api/categorizeActivity')).toBeTruthy();
  expect(screen.getByText('Category set successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when categorizing a fitness activity fails. (from categorizeActivity_compareCalorieIntakeToGoal)', async () => {
  fetchMock.post('/api/categorizeActivity', { status: 500, body: { error: 'Failed to set category' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('activity-category'), { target: { value: 'Cycling' } });
    fireEvent.click(screen.getByTestId('submit-category'));
  });

  expect(fetchMock.called('/api/categorizeActivity')).toBeTruthy();
  expect(screen.getByText('Failed to set category')).toBeInTheDocument();
}, 10000);

test('compares calorie intake to goal successfully and displays comparison (from categorizeActivity_compareCalorieIntakeToGoal)', async () => {
  fetchMock.get('/api/compare-calories-goal', { status: 200, body: { comparison: 'Within goal' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Calorie intake is within the goal')).toBeInTheDocument();
}, 10000);

test('fails to compare calorie intake to goal and displays an error message (from categorizeActivity_compareCalorieIntakeToGoal)', async () => {
  fetchMock.get('/api/compare-calories-goal', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to compare calorie intake to goal.')).toBeInTheDocument();
}, 10000);

test('User can create a new fitness activity successfully. (from createActivity_provideSuggestionsForGoals)', async () => {
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

test('User sees an error message when creating a new fitness activity fails. (from createActivity_provideSuggestionsForGoals)', async () => {
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

test('provides suggestions for goals successfully and displays suggestions (from createActivity_provideSuggestionsForGoals)', async () => {
  fetchMock.get('/api/provide-suggestions', { status: 200, body: { suggestions: 'Increase protein intake' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Suggestion: Increase protein intake')).toBeInTheDocument();
}, 10000);

test('fails to provide suggestions for goals and displays an error message (from createActivity_provideSuggestionsForGoals)', async () => {
  fetchMock.get('/api/provide-suggestions', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to provide suggestions.')).toBeInTheDocument();
}, 10000);

