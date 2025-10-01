import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './dailyGoalAchievementNotification_detailedStatistics_logWaterIntake';

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

test('User can view detailed statistics of a specific fitness activity successfully.', async () => {
  fetchMock.get('/api/detailedStatistics', { status: 200, body: { data: { calories: 500 } } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-detailed-statistics'));
  });

  expect(fetchMock.called('/api/detailedStatistics')).toBeTruthy();
  expect(screen.getByText('500 calories')).toBeInTheDocument();
}, 10000);

test('User sees an error message when viewing detailed statistics fails.', async () => {
  fetchMock.get('/api/detailedStatistics', { status: 500, body: { error: 'Failed to fetch statistics' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-detailed-statistics'));
  });

  expect(fetchMock.called('/api/detailedStatistics')).toBeTruthy();
  expect(screen.getByText('Failed to fetch statistics')).toBeInTheDocument();
}, 10000);

test('logs water intake successfully and displays intake in the list', async () => {
  fetchMock.post('/api/log-water-intake', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter water intake'), { target: { value: '500' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Water')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Water logged successfully!')).toBeInTheDocument();
}, 10000);

test('fails to log water intake and displays an error message', async () => {
  fetchMock.post('/api/log-water-intake', { status: 400, body: { error: 'Invalid intake' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter water intake'), { target: { value: '-100' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Log Water')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log water intake.')).toBeInTheDocument();
}, 10000);
