import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './reopenTask_taskFilterUser_removeTaskDependencies_updateTaskProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should reopen a completed task successfully. (from reopenTask_taskFilterUser)', async () => {
  fetchMock.post('/api/reopenTask', { status: 200, body: { taskId: 1, completed: false }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('reopen-task-button')); });

  expect(fetchMock.calls('/api/reopenTask')).toHaveLength(1);
  expect(screen.getByText('Task reopened!')).toBeInTheDocument();
}, 10000);

test('should display error when reopening task fails. (from reopenTask_taskFilterUser)', async () => {
  fetchMock.post('/api/reopenTask', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('reopen-task-button')); });

  expect(fetchMock.calls('/api/reopenTask')).toHaveLength(1);
  expect(screen.getByText('Failed to reopen task.')).toBeInTheDocument();
}, 10000);

test('Filter tasks by assigned user successfully. (from reopenTask_taskFilterUser)', async () => {
  fetchMock.get('/api/tasks?assignedUser=user1', {
    tasks: [{ id: 3, title: 'Task 3', assignedUser: 'user1' }],
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by assigned user'), { target: { value: 'user1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Task 3')).toBeInTheDocument();
}, 10000);

test('Fail to filter tasks by assigned user when API returns 500. (from reopenTask_taskFilterUser)', async () => {
  fetchMock.get('/api/tasks?assignedUser=user1', 500);
  
  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by assigned user'), { target: { value: 'user1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter tasks.')).toBeInTheDocument();
}, 10000);

test('successfully removes task dependencies. (from removeTaskDependencies_updateTaskProgress)', async () => {
  fetchMock.delete('/api/task-dependencies', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Task 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-dependency-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Dependency removed successfully')).toBeInTheDocument();
}, 10000);

test('fails to remove task dependencies if server error. (from removeTaskDependencies_updateTaskProgress)', async () => {
  fetchMock.delete('/api/task-dependencies', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Task 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-dependency-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to remove dependencies')).toBeInTheDocument();
}, 10000);

test('should update task progress successfully. (from removeTaskDependencies_updateTaskProgress)', async () => {
  fetchMock.post('/api/updateProgress', { status: 200, body: { taskId: 1, progress: 50 }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('progress-input'), { target: { value: 50 } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Progress')); });

  expect(fetchMock.calls('/api/updateProgress')).toHaveLength(1);
  expect(screen.getByText('Task progress updated!')).toBeInTheDocument();
}, 10000);

test('should show error when updating progress fails. (from removeTaskDependencies_updateTaskProgress)', async () => {
  fetchMock.post('/api/updateProgress', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('progress-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Progress')); });

  expect(fetchMock.calls('/api/updateProgress')).toHaveLength(1);
  expect(screen.getByText('Failed to update task progress.')).toBeInTheDocument();
}, 10000);

