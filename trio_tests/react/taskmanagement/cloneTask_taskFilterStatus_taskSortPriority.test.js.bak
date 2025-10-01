import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './cloneTask_taskFilterStatus_taskSortPriority';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should clone an existing task successfully.', async () => {
  fetchMock.post('/api/cloneTask', { status: 200, body: { id: 3, clonedFromId: 1 }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('clone-task-button')); });

  expect(fetchMock.calls('/api/cloneTask')).toHaveLength(1);
  expect(screen.getByText('Task cloned successfully!')).toBeInTheDocument();
}, 10000);

test('should show error when cloning task fails.', async () => {
  fetchMock.post('/api/cloneTask', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('clone-task-button')); });

  expect(fetchMock.calls('/api/cloneTask')).toHaveLength(1);
  expect(screen.getByText('Failed to clone task.')).toBeInTheDocument();
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

test('Sort tasks by priority successfully.', async () => {
  fetchMock.get('/api/tasks?sort=priority', {
    tasks: [
      { id: 6, title: 'Task 6', priority: 'high' },
      { id: 7, title: 'Task 7', priority: 'low' },
    ],
  });

  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
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
    render(<MemoryRouter><TaskList /></MemoryRouter>);
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
