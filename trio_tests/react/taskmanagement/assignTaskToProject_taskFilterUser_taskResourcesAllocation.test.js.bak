import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './assignTaskToProject_taskFilterUser_taskResourcesAllocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should assign task to a project successfully.', async () => {
  fetchMock.post('/api/assignTask', { status: 200, body: { taskId: 1, projectId: 1 }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 1 } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('project-select'), { target: { value: 1 } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls('/api/assignTask')).toHaveLength(1);
  expect(screen.getByText('Task assigned successfully!')).toBeInTheDocument();
}, 10000);

test('should show error message when failing to assign task.', async () => {
  fetchMock.post('/api/assignTask', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 1 } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('project-select'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls('/api/assignTask')).toHaveLength(1);
  expect(screen.getByText('Failed to assign task.')).toBeInTheDocument();
}, 10000);

test('Filter tasks by assigned user successfully.', async () => {
  fetchMock.get('/api/tasks?assignedUser=user1', {
    tasks: [{ id: 3, title: 'Task 3', assignedUser: 'user1' }],
  });

  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
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

test('Fail to filter tasks by assigned user when API returns 500.', async () => {
  fetchMock.get('/api/tasks?assignedUser=user1', 500);
  
  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
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

test('successfully allocates resources to a task.', async () => {
  fetchMock.post('/api/resource-allocation', { success: true });

  await act(async () => { render(<MemoryRouter><ResourceAllocation /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resource-input'), { target: { value: '50%' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('allocate-resource-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Resource allocated successfully')).toBeInTheDocument();
}, 10000);

test('fails to allocate resources to a task if server error.', async () => {
  fetchMock.post('/api/resource-allocation', 500);

  await act(async () => { render(<MemoryRouter><ResourceAllocation /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resource-input'), { target: { value: '50%' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('allocate-resource-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to allocate resource')).toBeInTheDocument();
}, 10000);
