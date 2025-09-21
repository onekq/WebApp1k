import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteDailyGoal_totalDistanceCovered_trackProgressInChallenges';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should successfully delete a daily fitness goal', async () => {
  fetchMock.delete('/api/goals/daily/123', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><DeleteDailyGoal goalId="123" /></MemoryRouter>);
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
    render(<MemoryRouter><DeleteDailyGoal goalId="123" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/delete goal/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/failed to delete goal/i)).toBeInTheDocument();
}, 10000);

test('System calculates total distance covered in a week successfully.', async () => {
  fetchMock.get('/api/total-distance', { distance: 50 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-distance')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/50 miles/)).toBeInTheDocument();
}, 10000);

test('System fails to calculate total distance covered in a week.', async () => {
  fetchMock.get('/api/total-distance', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-distance')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching distance/)).toBeInTheDocument();
}, 10000);

test('System tracks progress in fitness challenges successfully.', async () => {
  fetchMock.get('/api/progress-challenges', { progress: '50%' });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-challenges')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/50%/)).toBeInTheDocument();
}, 10000);

test('System fails to track progress in fitness challenges.', async () => {
  fetchMock.get('/api/progress-challenges', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-challenges')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching challenges progress/)).toBeInTheDocument();
}, 10000);
