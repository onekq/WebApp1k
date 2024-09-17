import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './dailyGoalAchievementNotification_deleteActivity';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('System sends a notification when a daily goal is achieved successfully.', async () => {
  fetchMock.post('/api/daily-goal', { status: 'Goal Achieved' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-goal')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Goal Achieved/)).toBeInTheDocument();
}, 10000);

test('System fails to send a notification when a daily goal is achieved.', async () => {
  fetchMock.post('/api/daily-goal', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-goal')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error checking goal status/)).toBeInTheDocument();
}, 10000);

test('User can delete a fitness activity successfully.', async () => {
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

test('User sees an error message when deleting a fitness activity fails.', async () => {
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