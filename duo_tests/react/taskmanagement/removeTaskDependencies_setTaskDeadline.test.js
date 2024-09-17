import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './removeApp_setTaskDeadline';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully removes task dependencies.', async () => {
  fetchMock.delete('/api/task-dependencies', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Task 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-dependency-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Dependency removed successfully')).toBeInTheDocument();
}, 10000);

test('fails to remove task dependencies if server error.', async () => {
  fetchMock.delete('/api/task-dependencies', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Task 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-dependency-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to remove dependencies')).toBeInTheDocument();
}, 10000);

test('Set a due date for a task successfully.', async () => {
  fetchMock.post('/api/tasks/1/deadline', {
    task: { id: 1, title: 'Task 1', dueDate: '2023-10-10' },
  });

  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Set deadline'), { target: { value: '2023-10-10' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Deadline'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2023-10-10')).toBeInTheDocument();
}, 10000);

test('Fail to set a due date for a task when API returns 500.', async () => {
  fetchMock.post('/api/tasks/1/deadline', 500);
  
  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Set deadline'), { target: { value: '2023-10-10' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Deadline'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to set deadline.')).toBeInTheDocument();
}, 10000);