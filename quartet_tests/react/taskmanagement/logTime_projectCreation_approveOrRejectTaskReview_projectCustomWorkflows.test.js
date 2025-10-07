import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './logTime_projectCreation_approveOrRejectTaskReview_projectCustomWorkflows';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Log time spent on a task successfully. (from logTime_projectCreation)', async () => {
  fetchMock.post('/api/tasks/1/time', {
    timeLog: { id: 1, taskId: 1, hours: 3 },
  });

  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Log time'), { target: { value: '3' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Log Time'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('3 hours logged')).toBeInTheDocument();
}, 10000);

test('Fail to log time spent on a task when API returns 500. (from logTime_projectCreation)', async () => {
  fetchMock.post('/api/tasks/1/time', 500);
  
  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Log time'), { target: { value: '3' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Log Time'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to log time.')).toBeInTheDocument();
}, 10000);

test('Create Project - success (from logTime_projectCreation)', async () => {
  fetchMock.post('/api/projects', 201);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Project' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Project Description' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
  });

  expect(fetchMock.calls('/api/projects')).toHaveLength(1);
  expect(screen.getByText(/project created successfully/i)).toBeInTheDocument();
}, 10000);

test('Create Project - failure (from logTime_projectCreation)', async () => {
  fetchMock.post('/api/projects', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Project' } });
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Project Description' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /create project/i }));
  });

  expect(fetchMock.calls('/api/projects')).toHaveLength(1);
  expect(screen.getByText(/failed to create project/i)).toBeInTheDocument();
}, 10000);

test('Approve a task review successfully (from approveOrRejectTaskReview_projectCustomWorkflows)', async () => {
  fetchMock.post('/approve-review', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('approve-review-button')); });

  expect(fetchMock.calls('/approve-review').length).toBe(1);
  expect(screen.getByText('Review approved successfully')).toBeInTheDocument();
}, 10000);

test('Fail to approve a task review due to server error (from approveOrRejectTaskReview_projectCustomWorkflows)', async () => {
  fetchMock.post('/approve-review', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('approve-review-button')); });

  expect(fetchMock.calls('/approve-review').length).toBe(1);
  expect(screen.getByText('Error approving review')).toBeInTheDocument();
}, 10000);

test('Custom Workflows for Projects - success (from approveOrRejectTaskReview_projectCustomWorkflows)', async () => {
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

test('Custom Workflows for Projects - failure (from approveOrRejectTaskReview_projectCustomWorkflows)', async () => {
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

