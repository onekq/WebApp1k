import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './compareTime_createSubtask_taskFilterStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Compare estimated time to actual time spent on a task successfully.', async () => {
  fetchMock.get('/api/tasks/1/time-comparison', {
    comparison: { estimated: 5, actual: 3 },
  });

  await act(async () => {
    render(<MemoryRouter><TaskDetail taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Estimated: 5 hours')).toBeInTheDocument();
  expect(screen.getByText('Actual: 3 hours')).toBeInTheDocument();
}, 10000);

test('Fail to compare estimated time to actual time spent on a task when API returns 500.', async () => {
  fetchMock.get('/api/tasks/1/time-comparison', 500);
  
  await act(async () => {
    render(<MemoryRouter><TaskDetail taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load time comparison.')).toBeInTheDocument();
}, 10000);

test('should create a subtask under a parent task successfully.', async () => {
  fetchMock.post('/api/createSubtask', { status: 201, body: { id: 2, parentId: 1, title: 'New Subtask' }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Subtask Title'), { target: { value: 'New Subtask' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Subtask')); });

  expect(fetchMock.calls('/api/createSubtask')).toHaveLength(1);
  expect(screen.getByText('Subtask created successfully!')).toBeInTheDocument();
}, 10000);

test('should show error when creating subtask fails.', async () => {
  fetchMock.post('/api/createSubtask', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Subtask Title'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Subtask')); });

  expect(fetchMock.calls('/api/createSubtask')).toHaveLength(1);
  expect(screen.getByText('Failed to create subtask.')).toBeInTheDocument();
}, 10000);

test('Filter tasks by status successfully.', async () => {
  fetchMock.get('/api/tasks?status=completed', {
    tasks: [{ id: 1, title: 'Task 1', status: 'completed' }],
  });

  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by status'), { target: { value: 'completed' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Task 1')).toBeInTheDocument();
}, 10000);

test('Fail to filter tasks by status when API returns 500.', async () => {
  fetchMock.get('/api/tasks?status=completed', 500);
  
  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by status'), { target: { value: 'completed' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter tasks.')).toBeInTheDocument();
}, 10000);
