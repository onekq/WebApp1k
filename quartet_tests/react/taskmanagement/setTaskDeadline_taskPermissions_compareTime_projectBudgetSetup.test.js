import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setTaskDeadline_taskPermissions_compareTime_projectBudgetSetup';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Set a due date for a task successfully. (from setTaskDeadline_taskPermissions)', async () => {
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

test('Fail to set a due date for a task when API returns 500. (from setTaskDeadline_taskPermissions)', async () => {
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

test('Set task-specific permissions for users successfully (from setTaskDeadline_taskPermissions)', async () => {
  fetchMock.post('/set-task-permissions', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('permission-select'), { target: { value: 'edit' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-permission-button')); });

  expect(fetchMock.calls('/set-task-permissions').length).toBe(1);
  expect(screen.getByText('Permissions set successfully')).toBeInTheDocument();
}, 10000);

test('Fail to set task-specific permissions for users due to server error (from setTaskDeadline_taskPermissions)', async () => {
  fetchMock.post('/set-task-permissions', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('permission-select'), { target: { value: 'edit' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-permission-button')); });

  expect(fetchMock.calls('/set-task-permissions').length).toBe(1);
  expect(screen.getByText('Error setting permissions')).toBeInTheDocument();
}, 10000);

test('Compare estimated time to actual time spent on a task successfully. (from compareTime_projectBudgetSetup)', async () => {
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

test('Fail to compare estimated time to actual time spent on a task when API returns 500. (from compareTime_projectBudgetSetup)', async () => {
  fetchMock.get('/api/tasks/1/time-comparison', 500);
  
  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load time comparison.')).toBeInTheDocument();
}, 10000);

test('Set Project Budget - success (from compareTime_projectBudgetSetup)', async () => {
  fetchMock.post('/api/projects/budget', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/budget amount/i), { target: { value: '1000' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /set budget/i }));
  });

  expect(fetchMock.calls('/api/projects/budget')).toHaveLength(1);
  expect(screen.getByText(/budget set successfully/i)).toBeInTheDocument();
}, 10000);

test('Set Project Budget - failure (from compareTime_projectBudgetSetup)', async () => {
  fetchMock.post('/api/projects/budget', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/budget amount/i), { target: { value: '1000' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /set budget/i }));
  });

  expect(fetchMock.calls('/api/projects/budget')).toHaveLength(1);
  expect(screen.getByText(/failed to set budget/i)).toBeInTheDocument();
}, 10000);

