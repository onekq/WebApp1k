import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './changeTaskDeadline_recurringTask';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Change the due date of an existing task successfully.', async () => {
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

test('Fail to change the due date of an existing task when API returns 500.', async () => {
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

test('successfully sets a task to recur.', async () => {
  fetchMock.post('/api/task-recurrence', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurrence-input'), { target: { value: 'Weekly' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Recurrence set successfully')).toBeInTheDocument();
}, 10000);

test('fails to set a task to recur if server error.', async () => {
  fetchMock.post('/api/task-recurrence', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('recurrence-input'), { target: { value: 'Weekly' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set recurrence')).toBeInTheDocument();
}, 10000);