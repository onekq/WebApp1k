import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './recurringTask_updateTaskProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('should update task progress successfully.', async () => {
  fetchMock.post('/api/updateProgress', { status: 200, body: { taskId: 1, progress: 50 }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('progress-input'), { target: { value: 50 } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Progress')); });

  expect(fetchMock.calls('/api/updateProgress')).toHaveLength(1);
  expect(screen.getByText('Task progress updated!')).toBeInTheDocument();
}, 10000);

test('should show error when updating progress fails.', async () => {
  fetchMock.post('/api/updateProgress', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('progress-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Progress')); });

  expect(fetchMock.calls('/api/updateProgress')).toHaveLength(1);
  expect(screen.getByText('Failed to update task progress.')).toBeInTheDocument();
}, 10000);