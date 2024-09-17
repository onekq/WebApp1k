import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setApp_updateTaskProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully sets task dependencies.', async () => {
  fetchMock.post('/api/task-dependencies', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Task 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-dependency-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Dependency set successfully')).toBeInTheDocument();
}, 10000);

test('fails to set task dependencies if server error.', async () => {
  fetchMock.post('/api/task-dependencies', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Task 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('set-dependency-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set dependencies')).toBeInTheDocument();
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