import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './awardBadgesForMilestones_compareProgressWithFriends_deleteActivity';

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

test('User can compare their progress with friends successfully.', async () => {
  fetchMock.get('/api/friends-comparison', { comparison: 'Better than average' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-friends-comparison')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Better than average/)).toBeInTheDocument();
}, 10000);

test('User fails to compare their progress with friends.', async () => {
  fetchMock.get('/api/friends-comparison', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('fetch-friends-comparison')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText(/Error fetching friends comparison/)).toBeInTheDocument();
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
