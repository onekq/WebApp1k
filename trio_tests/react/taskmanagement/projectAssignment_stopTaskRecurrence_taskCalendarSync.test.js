import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './projectAssignment_stopTaskRecurrence_taskCalendarSync';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Assign Users to Project - success', async () => {
  fetchMock.post('/api/projects/assign-users', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/users/i), { target: { value: 'User1, User2' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /assign users/i }));
  });

  expect(fetchMock.calls('/api/projects/assign-users')).toHaveLength(1);
  expect(screen.getByText(/users assigned successfully/i)).toBeInTheDocument();
}, 10000);

test('Assign Users to Project - failure', async () => {
  fetchMock.post('/api/projects/assign-users', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/users/i), { target: { value: 'User1, User2' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /assign users/i }));
  });

  expect(fetchMock.calls('/api/projects/assign-users')).toHaveLength(1);
  expect(screen.getByText(/failed to assign users/i)).toBeInTheDocument();
}, 10000);

test('successfully stops task recurrence.', async () => {
  fetchMock.post('/api/stop-task-recurrence', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('stop-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Recurrence stopped successfully')).toBeInTheDocument();
}, 10000);

test('fails to stop task recurrence if server error.', async () => {
  fetchMock.post('/api/stop-task-recurrence', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('stop-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to stop recurrence')).toBeInTheDocument();
}, 10000);

test('successfully syncs task deadlines with an external calendar.', async () => {
  fetchMock.post('/api/calendar-sync', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-calendar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Calendar synced successfully')).toBeInTheDocument();
}, 10000);

test('fails to sync task deadlines with an external calendar if server error.', async () => {
  fetchMock.post('/api/calendar-sync', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-calendar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to sync calendar')).toBeInTheDocument();
}, 10000);
