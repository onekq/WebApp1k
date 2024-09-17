import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './predictFutureAchievements_setCalorieIntakeGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('should successfully set a calorie intake goal', async () => {
  fetchMock.post('/api/goals/calories', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/calorie goal/i), { target: { value: 2000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/goal set successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when setting a calorie intake goal fails', async () => {
  fetchMock.post('/api/goals/calories', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/calorie goal/i), { target: { value: 2000 } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/set goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to set goal/i)).toBeInTheDocument();
}, 10000);