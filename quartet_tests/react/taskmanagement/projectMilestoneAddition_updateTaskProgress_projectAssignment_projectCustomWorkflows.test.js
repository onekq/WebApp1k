import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './projectMilestoneAddition_updateTaskProgress_projectAssignment_projectCustomWorkflows';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Add Milestone to Project - success (from projectMilestoneAddition_updateTaskProgress)', async () => {
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

test('Add Milestone to Project - failure (from projectMilestoneAddition_updateTaskProgress)', async () => {
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

test('should update task progress successfully. (from projectMilestoneAddition_updateTaskProgress)', async () => {
  fetchMock.post('/api/updateProgress', { status: 200, body: { taskId: 1, progress: 50 }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('progress-input'), { target: { value: 50 } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Progress')); });

  expect(fetchMock.calls('/api/updateProgress')).toHaveLength(1);
  expect(screen.getByText('Task progress updated!')).toBeInTheDocument();
}, 10000);

test('should show error when updating progress fails. (from projectMilestoneAddition_updateTaskProgress)', async () => {
  fetchMock.post('/api/updateProgress', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('progress-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Progress')); });

  expect(fetchMock.calls('/api/updateProgress')).toHaveLength(1);
  expect(screen.getByText('Failed to update task progress.')).toBeInTheDocument();
}, 10000);

test('Assign Users to Project - success (from projectAssignment_projectCustomWorkflows)', async () => {
  fetchMock.post('/api/projects/assign-users', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/users/i), { target: { value: 'User1, User2' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /assign users/i }));
  });

  expect(fetchMock.calls('/api/projects/assign-users')).toHaveLength(1);
  expect(screen.getByText(/users assigned successfully/i)).toBeInTheDocument();
}, 10000);

test('Assign Users to Project - failure (from projectAssignment_projectCustomWorkflows)', async () => {
  fetchMock.post('/api/projects/assign-users', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/users/i), { target: { value: 'User1, User2' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /assign users/i }));
  });

  expect(fetchMock.calls('/api/projects/assign-users')).toHaveLength(1);
  expect(screen.getByText(/failed to assign users/i)).toBeInTheDocument();
}, 10000);

test('Custom Workflows for Projects - success (from projectAssignment_projectCustomWorkflows)', async () => {
  fetchMock.post('/api/projects/workflows', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/workflow name/i), { target: { value: 'Workflow1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /define workflow/i }));
  });

  expect(fetchMock.calls('/api/projects/workflows')).toHaveLength(1);
  expect(screen.getByText(/workflow defined successfully/i)).toBeInTheDocument();
}, 10000);

test('Custom Workflows for Projects - failure (from projectAssignment_projectCustomWorkflows)', async () => {
  fetchMock.post('/api/projects/workflows', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/workflow name/i), { target: { value: 'Workflow1' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /define workflow/i }));
  });

  expect(fetchMock.calls('/api/projects/workflows')).toHaveLength(1);
  expect(screen.getByText(/failed to define workflow/i)).toBeInTheDocument();
}, 10000);

