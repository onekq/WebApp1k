import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customNotificationsForUsers_projectAssignment_setTaskDependencies';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('successfully sets task dependencies.', async () => {
  fetchMock.post('/api/task-dependencies', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Task 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-dependency-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Dependency set successfully')).toBeInTheDocument();
}, 10000);

test('fails to set task dependencies if server error.', async () => {
  fetchMock.post('/api/task-dependencies', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Task 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-dependency-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set dependencies')).toBeInTheDocument();
}, 10000);
