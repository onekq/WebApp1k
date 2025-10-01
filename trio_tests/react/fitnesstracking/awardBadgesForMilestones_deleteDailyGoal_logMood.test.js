import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './awardBadgesForMilestones_deleteDailyGoal_logMood';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('System awards badges for milestones achieved successfully.', async () => {
  fetchMock.get('/api/award-badges', { badge: '100 miles run' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('award-badge')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/100 miles run/)).toBeInTheDocument();
}, 10000);

test('System fails to award badges for milestones achieved.', async () => {
  fetchMock.get('/api/award-badges', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('award-badge')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error awarding badges/)).toBeInTheDocument();
}, 10000);

test('should successfully delete a daily fitness goal', async () => {
  fetchMock.delete('/api/goals/daily/123', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App goalId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/goal deleted successfully/i)).toBeInTheDocument();
}, 10000);

test('should show error when deleting a daily fitness goal fails', async () => {
  fetchMock.delete('/api/goals/daily/123', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App goalId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to delete goal/i)).toBeInTheDocument();
}, 10000);

test('User can log their mood after workouts successfully.', async () => {
  fetchMock.post('/api/logMood', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('mood'), { target: { value: 'Happy' } });
    fireEvent.click(screen.getByTestId('submit-mood'));
  });

  expect(fetchMock.called('/api/logMood')).toBeTruthy();
  expect(screen.getByText('Mood logged successfully')).toBeInTheDocument();
}, 10000);

test('User sees an error message when logging their mood fails.', async () => {
  fetchMock.post('/api/logMood', { status: 500, body: { error: 'Failed to log mood' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('mood'), { target: { value: 'Happy' } });
    fireEvent.click(screen.getByTestId('submit-mood'));
  });

  expect(fetchMock.called('/api/logMood')).toBeTruthy();
  expect(screen.getByText('Failed to log mood')).toBeInTheDocument();
}, 10000);
