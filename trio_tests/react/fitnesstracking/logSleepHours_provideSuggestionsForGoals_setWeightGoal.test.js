import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './logSleepHours_provideSuggestionsForGoals_setWeightGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('logs sleep hours successfully and displays hours in the list', async () => {
  fetchMock.post('/api/log-sleep', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter sleep hours'), { target: { value: '8' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Sleep')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sleep hours logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log sleep hours and displays an error message', async () => {
  fetchMock.post('/api/log-sleep', { status: 400, body: { error: 'Invalid hours' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter sleep hours'), { target: { value: '-5' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Sleep')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log sleep hours.')).toBeInTheDocument();
}, 10000);

test('provides suggestions for goals successfully and displays suggestions', async () => {
  fetchMock.get('/api/provide-suggestions', { status: 200, body: { suggestions: 'Increase protein intake' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Suggestion: Increase protein intake')).toBeInTheDocument();
}, 10000);

test('fails to provide suggestions for goals and displays an error message', async () => {
  fetchMock.get('/api/provide-suggestions', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to provide suggestions.')).toBeInTheDocument();
}, 10000);

test('should successfully set a weight goal', async () => {
  fetchMock.post('/api/goals/weight', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><SetWeightGoal /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/weight goal/i), { target: { value: 150 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/goal set successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when setting a weight goal fails', async () => {
  fetchMock.post('/api/goals/weight', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><SetWeightGoal /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/weight goal/i), { target: { value: 150 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to set goal/i)).toBeInTheDocument();
}, 10000);
