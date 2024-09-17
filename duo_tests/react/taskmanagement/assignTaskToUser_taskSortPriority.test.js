import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './assignTaskToUser_taskSortPriority';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Assign task to user successfully', async () => {
  fetchMock.post('/assign-task', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'New Task' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('assign-task-button')); });

  expect(fetchMock.calls('/assign-task').length).toBe(1);
  expect(screen.getByText('Task assigned successfully')).toBeInTheDocument();
}, 10000);

test('Fail to assign task due to server error', async () => {
  fetchMock.post('/assign-task', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'New Task' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('assign-task-button')); });

  expect(fetchMock.calls('/assign-task').length).toBe(1);
  expect(screen.getByText('Error assigning task')).toBeInTheDocument();
}, 10000);

test('Sort tasks by priority successfully.', async () => {
  fetchMock.get('/api/tasks?sort=priority', {
    tasks: [
      { id: 6, title: 'Task 6', priority: 'high' },
      { id: 7, title: 'Task 7', priority: 'low' },
    ],
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Sort by'), { target: { value: 'priority' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Task 6')).toBeInTheDocument();
  expect(screen.getByText('Task 7')).toBeInTheDocument();
}, 10000);

test('Fail to sort tasks by priority when API returns 500.', async () => {
  fetchMock.get('/api/tasks?sort=priority', 500);
  
  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Sort by'), { target: { value: 'priority' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort tasks.')).toBeInTheDocument();
}, 10000);