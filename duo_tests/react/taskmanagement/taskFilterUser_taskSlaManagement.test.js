import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './taskFilterUser_taskSlaManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter tasks by assigned user successfully.', async () => {
  fetchMock.get('/api/tasks?assignedUser=user1', {
    tasks: [{ id: 3, title: 'Task 3', assignedUser: 'user1' }],
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
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
    render(<MemoryRouter><App /></MemoryRouter>);
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

test('successfully sets SLAs for tasks.', async () => {
  fetchMock.post('/api/task-sla', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sla-input'), { target: { value: '24 hours' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-sla-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('SLAs set successfully')).toBeInTheDocument();
}, 10000);

test('fails to set SLAs for tasks if server error.', async () => {
  fetchMock.post('/api/task-sla', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sla-input'), { target: { value: '24 hours' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-sla-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set SLAs')).toBeInTheDocument();
}, 10000);