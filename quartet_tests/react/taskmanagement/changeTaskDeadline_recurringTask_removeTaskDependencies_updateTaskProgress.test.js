import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './changeTaskDeadline_recurringTask_removeTaskDependencies_updateTaskProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Change the due date of an existing task successfully. (from changeTaskDeadline_recurringTask)', async () => {
  fetchMock.put('/api/tasks/1/deadline', {
    task: { id: 1, title: 'Task 1', dueDate: '2023-10-11' },
  });

  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Change deadline'), { target: { value: '2023-10-11' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Update Deadline'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2023-10-11')).toBeInTheDocument();
}, 10000);

test('Fail to change the due date of an existing task when API returns 500. (from changeTaskDeadline_recurringTask)', async () => {
  fetchMock.put('/api/tasks/1/deadline', 500);
  
  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Change deadline'), { target: { value: '2023-10-11' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Update Deadline'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to change deadline.')).toBeInTheDocument();
}, 10000);

test('successfully sets a task to recur. (from changeTaskDeadline_recurringTask)', async () => {
  fetchMock.post('/api/task-recurrence', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurrence-input'), { target: { value: 'Weekly' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Recurrence set successfully')).toBeInTheDocument();
}, 10000);

test('fails to set a task to recur if server error. (from changeTaskDeadline_recurringTask)', async () => {
  fetchMock.post('/api/task-recurrence', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurrence-input'), { target: { value: 'Weekly' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set recurrence')).toBeInTheDocument();
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

