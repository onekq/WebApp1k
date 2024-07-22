import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './dailyGoalAchievementNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('System sends a notification when a daily goal is achieved successfully.', async () => {
  fetchMock.post('/api/daily-goal', { status: 'Goal Achieved' });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-goal')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Goal Achieved/)).toBeInTheDocument();
}, 10000);

test('System fails to send a notification when a daily goal is achieved.', async () => {
  fetchMock.post('/api/daily-goal', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-goal')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error checking goal status/)).toBeInTheDocument();
}, 10000);

