import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareTime_customNotificationsForUsers_projectMilestoneAddition';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Compare estimated time to actual time spent on a task successfully.', async () => {
  fetchMock.get('/api/tasks/1/time-comparison', {
    comparison: { estimated: 5, actual: 3 },
  });

  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Estimated: 5 hours')).toBeInTheDocument();
  expect(screen.getByText('Actual: 3 hours')).toBeInTheDocument();
}, 10000);

test('Fail to compare estimated time to actual time spent on a task when API returns 500.', async () => {
  fetchMock.get('/api/tasks/1/time-comparison', 500);
  
  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load time comparison.')).toBeInTheDocument();
}, 10000);

test('Set custom notification preferences successfully', async () => {
  fetchMock.post('/set-notifications', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-checkbox')); });

  expect(fetchMock.calls('/set-notifications').length).toBe(1);
  expect(screen.getByText('Notifications set successfully')).toBeInTheDocument();
}, 10000);

test('Fail to set custom notification preferences due to server error', async () => {
  fetchMock.post('/set-notifications', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-checkbox')); });

  expect(fetchMock.calls('/set-notifications').length).toBe(1);
  expect(screen.getByText('Error setting notifications')).toBeInTheDocument();
}, 10000);

test('Add Milestone to Project - success', async () => {
  fetchMock.post('/api/projects/milestone', 201);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/milestone name/i), { target: { value: 'Milestone1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /add milestone/i }));
  });

  expect(fetchMock.calls('/api/projects/milestone')).toHaveLength(1);
  expect(screen.getByText(/milestone added successfully/i)).toBeInTheDocument();
}, 10000);

test('Add Milestone to Project - failure', async () => {
  fetchMock.post('/api/projects/milestone', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/milestone name/i), { target: { value: 'Milestone1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /add milestone/i }));
  });

  expect(fetchMock.calls('/api/projects/milestone')).toHaveLength(1);
  expect(screen.getByText(/failed to add milestone/i)).toBeInTheDocument();
}, 10000);
