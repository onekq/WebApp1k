import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './awardBadgesForMilestones_logOutdoorActivity_totalYogaDuration';

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

test('should calculate total yoga duration successfully.', async () => {
  fetchMock.get('/api/yoga/duration', { status: 200, body: { totalDuration: '10 hours' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-duration-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/yoga/duration')).toBe(true);
  expect(screen.getByText('Total Duration: 10 hours')).toBeInTheDocument();
}, 10000);

test('should fail to calculate total yoga duration.', async () => {
  fetchMock.get('/api/yoga/duration', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('calculate-duration-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/yoga/duration')).toBe(true);
  expect(screen.getByText('Failed to calculate total duration.')).toBeInTheDocument();
}, 10000);
