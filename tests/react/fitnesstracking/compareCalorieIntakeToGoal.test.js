import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareCalorieIntakeToGoal';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('compares calorie intake to goal successfully and displays comparison', async () => {
  fetchMock.get('/api/compare-calories-goal', { status: 200, body: { comparison: 'Within goal' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Calorie intake is within the goal')).toBeInTheDocument();
}, 10000);

test('fails to compare calorie intake to goal and displays an error message', async () => {
  fetchMock.get('/api/compare-calories-goal', { status: 500, body: { error: 'Server error' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to compare calorie intake to goal.')).toBeInTheDocument();
}, 10000);

