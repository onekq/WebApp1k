import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setTaskPriority_taskFilterStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should set task priority successfully.', async () => {
  fetchMock.post('/api/setPriority', { status: 200, body: { taskId: 1, priority: 'High' }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('priority-select'), { target: { value: 'High' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Set Priority')); });

  expect(fetchMock.calls('/api/setPriority')).toHaveLength(1);
  expect(screen.getByText('Task priority updated!')).toBeInTheDocument();
}, 10000);

test('should display error when setting task priority fails.', async () => {
  fetchMock.post('/api/setPriority', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('priority-select'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Set Priority')); });

  expect(fetchMock.calls('/api/setPriority')).toHaveLength(1);
  expect(screen.getByText('Failed to set task priority.')).toBeInTheDocument();
}, 10000);

test('Filter tasks by status successfully.', async () => {
  fetchMock.get('/api/tasks?status=completed', {
    tasks: [{ id: 1, title: 'Task 1', status: 'completed' }],
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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
    render(<MemoryRouter><App /></MemoryRouter>);
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