import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './logOutdoorActivity_predictFutureAchievements_setWeightGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('User can log an outdoor activity and track the route using GPS successfully.', async () => {
  fetchMock.post('/api/logOutdoorActivity', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('outdoor-activity-type'), { target: { value: 'Hiking' } });
    fireEvent.click(screen.getByTestId('track-activity'));
  });

  expect(fetchMock.called('/api/logOutdoorActivity')).toBeTruthy();
  expect(screen.getByText('Outdoor activity tracked successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when logging an outdoor activity fails.', async () => {
  fetchMock.post('/api/logOutdoorActivity', { status: 500, body: { error: 'Failed to track activity' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('outdoor-activity-type'), { target: { value: 'Hiking' } });
    fireEvent.click(screen.getByTestId('track-activity'));
  });

  expect(fetchMock.called('/api/logOutdoorActivity')).toBeTruthy();
  expect(screen.getByText('Failed to track activity')).toBeInTheDocument();
}, 10000);

test('System predicts future fitness achievements based on current progress successfully.', async () => {
  fetchMock.get('/api/predict-achievements', { prediction: '5K run next month' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('predict-achievements')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/5K run next month/)).toBeInTheDocument();
}, 10000);

test('System fails to predict future fitness achievements based on current progress.', async () => {
  fetchMock.get('/api/predict-achievements', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('predict-achievements')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error predicting achievements/)).toBeInTheDocument();
}, 10000);

test('should successfully set a weight goal', async () => {
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

test('should show error when setting a weight goal fails', async () => {
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
