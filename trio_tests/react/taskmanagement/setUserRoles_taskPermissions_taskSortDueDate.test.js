import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setUserRoles_taskPermissions_taskSortDueDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Set user roles successfully', async () => {
  fetchMock.post('/set-user-roles', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('role-manager-button')); });

  expect(fetchMock.calls('/set-user-roles').length).toBe(1);
  expect(screen.getByText('Role assigned successfully')).toBeInTheDocument();
}, 10000);

test('Fail to set user roles due to server error', async () => {
  fetchMock.post('/set-user-roles', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('role-manager-button')); });

  expect(fetchMock.calls('/set-user-roles').length).toBe(1);
  expect(screen.getByText('Error assigning role')).toBeInTheDocument();
}, 10000);

test('Set task-specific permissions for users successfully', async () => {
  fetchMock.post('/set-task-permissions', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('permission-select'), { target: { value: 'edit' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-permission-button')); });

  expect(fetchMock.calls('/set-task-permissions').length).toBe(1);
  expect(screen.getByText('Permissions set successfully')).toBeInTheDocument();
}, 10000);

test('Fail to set task-specific permissions for users due to server error', async () => {
  fetchMock.post('/set-task-permissions', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('permission-select'), { target: { value: 'edit' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-permission-button')); });

  expect(fetchMock.calls('/set-task-permissions').length).toBe(1);
  expect(screen.getByText('Error setting permissions')).toBeInTheDocument();
}, 10000);

test('Sort tasks by due date successfully.', async () => {
  fetchMock.get('/api/tasks?sort=dueDate', {
    tasks: [
      { id: 4, title: 'Task 4', dueDate: '2023-10-09' },
      { id: 5, title: 'Task 5', dueDate: '2023-10-10' },
    ],
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Sort by'), { target: { value: 'dueDate' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Task 4')).toBeInTheDocument();
  expect(screen.getByText('Task 5')).toBeInTheDocument();
}, 10000);

test('Fail to sort tasks by due date when API returns 500.', async () => {
  fetchMock.get('/api/tasks?sort=dueDate', 500);
  
  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Sort by'), { target: { value: 'dueDate' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort tasks.')).toBeInTheDocument();
}, 10000);
