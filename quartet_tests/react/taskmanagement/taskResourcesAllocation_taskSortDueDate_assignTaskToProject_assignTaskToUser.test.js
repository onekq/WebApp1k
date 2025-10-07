import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './taskResourcesAllocation_taskSortDueDate_assignTaskToProject_assignTaskToUser';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully allocates resources to a task. (from taskResourcesAllocation_taskSortDueDate)', async () => {
  fetchMock.post('/api/resource-allocation', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resource-input'), { target: { value: '50%' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('allocate-resource-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Resource allocated successfully')).toBeInTheDocument();
}, 10000);

test('fails to allocate resources to a task if server error. (from taskResourcesAllocation_taskSortDueDate)', async () => {
  fetchMock.post('/api/resource-allocation', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resource-input'), { target: { value: '50%' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('allocate-resource-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to allocate resource')).toBeInTheDocument();
}, 10000);

test('Sort tasks by due date successfully. (from taskResourcesAllocation_taskSortDueDate)', async () => {
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

test('Fail to sort tasks by due date when API returns 500. (from taskResourcesAllocation_taskSortDueDate)', async () => {
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

test('should assign task to a project successfully. (from assignTaskToProject_assignTaskToUser)', async () => {
  fetchMock.post('/api/assignTask', { status: 200, body: { taskId: 1, projectId: 1 }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 1 } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('project-select'), { target: { value: 1 } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls('/api/assignTask')).toHaveLength(1);
  expect(screen.getByText('Task assigned successfully!')).toBeInTheDocument();
}, 10000);

test('should show error message when failing to assign task. (from assignTaskToProject_assignTaskToUser)', async () => {
  fetchMock.post('/api/assignTask', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 1 } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('project-select'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls('/api/assignTask')).toHaveLength(1);
  expect(screen.getByText('Failed to assign task.')).toBeInTheDocument();
}, 10000);

test('Assign task to user successfully (from assignTaskToProject_assignTaskToUser)', async () => {
  fetchMock.post('/assign-task', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'New Task' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('assign-task-button')); });

  expect(fetchMock.calls('/assign-task').length).toBe(1);
  expect(screen.getByText('Task assigned successfully')).toBeInTheDocument();
}, 10000);

test('Fail to assign task due to server error (from assignTaskToProject_assignTaskToUser)', async () => {
  fetchMock.post('/assign-task', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'New Task' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('assign-task-button')); });

  expect(fetchMock.calls('/assign-task').length).toBe(1);
  expect(screen.getByText('Error assigning task')).toBeInTheDocument();
}, 10000);

