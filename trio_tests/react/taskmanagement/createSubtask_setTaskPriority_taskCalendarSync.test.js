import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createSubtask_setTaskPriority_taskCalendarSync';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('successfully syncs task deadlines with an external calendar.', async () => {
  fetchMock.post('/api/calendar-sync', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-calendar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Calendar synced successfully')).toBeInTheDocument();
}, 10000);

test('fails to sync task deadlines with an external calendar if server error.', async () => {
  fetchMock.post('/api/calendar-sync', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-calendar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to sync calendar')).toBeInTheDocument();
}, 10000);
