import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './projectArchiving_projectMilestoneAddition_removeTaskDependencies_updateTaskProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Archive Project - success (from projectArchiving_projectMilestoneAddition)', async () => {
  fetchMock.post('/api/projects/archive', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /archive project/i }));
  });

  expect(fetchMock.calls('/api/projects/archive')).toHaveLength(1);
  expect(screen.getByText(/project archived successfully/i)).toBeInTheDocument();
}, 10000);

test('Archive Project - failure (from projectArchiving_projectMilestoneAddition)', async () => {
  fetchMock.post('/api/projects/archive', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /archive project/i }));
  });

  expect(fetchMock.calls('/api/projects/archive')).toHaveLength(1);
  expect(screen.getByText(/failed to archive project/i)).toBeInTheDocument();
}, 10000);

test('Add Milestone to Project - success (from projectArchiving_projectMilestoneAddition)', async () => {
  fetchMock.post('/api/projects/milestone', 201);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/milestone name/i), { target: { value: 'Milestone1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /add milestone/i }));
  });

  expect(fetchMock.calls('/api/projects/milestone')).toHaveLength(1);
  expect(screen.getByText(/milestone added successfully/i)).toBeInTheDocument();
}, 10000);

test('Add Milestone to Project - failure (from projectArchiving_projectMilestoneAddition)', async () => {
  fetchMock.post('/api/projects/milestone', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/milestone name/i), { target: { value: 'Milestone1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /add milestone/i }));
  });

  expect(fetchMock.calls('/api/projects/milestone')).toHaveLength(1);
  expect(screen.getByText(/failed to add milestone/i)).toBeInTheDocument();
}, 10000);

test('successfully removes task dependencies. (from removeTaskDependencies_updateTaskProgress)', async () => {
  fetchMock.delete('/api/task-dependencies', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Task 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-dependency-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Dependency removed successfully')).toBeInTheDocument();
}, 10000);

test('fails to remove task dependencies if server error. (from removeTaskDependencies_updateTaskProgress)', async () => {
  fetchMock.delete('/api/task-dependencies', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'Task 1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-dependency-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to remove dependencies')).toBeInTheDocument();
}, 10000);

test('should update task progress successfully. (from removeTaskDependencies_updateTaskProgress)', async () => {
  fetchMock.post('/api/updateProgress', { status: 200, body: { taskId: 1, progress: 50 }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('progress-input'), { target: { value: 50 } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Progress')); });

  expect(fetchMock.calls('/api/updateProgress')).toHaveLength(1);
  expect(screen.getByText('Task progress updated!')).toBeInTheDocument();
}, 10000);

test('should show error when updating progress fails. (from removeTaskDependencies_updateTaskProgress)', async () => {
  fetchMock.post('/api/updateProgress', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('progress-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Progress')); });

  expect(fetchMock.calls('/api/updateProgress')).toHaveLength(1);
  expect(screen.getByText('Failed to update task progress.')).toBeInTheDocument();
}, 10000);

