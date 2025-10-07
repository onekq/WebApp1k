import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteActivity_trackMoodChanges_logSleepHours_setWeightGoal';

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

test('logs sleep hours successfully and displays hours in the list (from logSleepHours_setWeightGoal)', async () => {
  fetchMock.post('/api/log-sleep', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter sleep hours'), { target: { value: '8' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Sleep')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sleep hours logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log sleep hours and displays an error message (from logSleepHours_setWeightGoal)', async () => {
  fetchMock.post('/api/log-sleep', { status: 400, body: { error: 'Invalid hours' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter sleep hours'), { target: { value: '-5' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Sleep')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log sleep hours.')).toBeInTheDocument();
}, 10000);

test('should successfully set a weight goal (from logSleepHours_setWeightGoal)', async () => {
  fetchMock.post('/api/goals/weight', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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

test('should show error when setting a weight goal fails (from logSleepHours_setWeightGoal)', async () => {
  fetchMock.post('/api/goals/weight', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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

