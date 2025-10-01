import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createTask_projectCustomWorkflows_taskCompletion';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should successfully create a new task.', async () => {
  fetchMock.post('/api/taskCreate', { status: 201, body: { id: 1, title: 'New Task', description: 'New task description' }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New task description' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create')); });

  expect(fetchMock.calls('/api/taskCreate')).toHaveLength(1);
  expect(screen.getByText('Task created successfully!')).toBeInTheDocument();
}, 10000);

test('should show error message when failing to create a task.', async () => {
  fetchMock.post('/api/taskCreate', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: '' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Description'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create')); });

  expect(fetchMock.calls('/api/taskCreate')).toHaveLength(1);
  expect(screen.getByText('Failed to create task.')).toBeInTheDocument();
}, 10000);

test('Custom Workflows for Projects - success', async () => {
  fetchMock.post('/api/projects/workflows', 200);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
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

test('Custom Workflows for Projects - failure', async () => {
  fetchMock.post('/api/projects/workflows', 400);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
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

test('should mark task as completed successfully.', async () => {
  fetchMock.post('/api/markComplete', { status: 200, body: { taskId: 1, completed: true }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('complete-task-button')); });

  expect(fetchMock.calls('/api/markComplete')).toHaveLength(1);
  expect(screen.getByText('Task marked as completed!')).toBeInTheDocument();
}, 10000);

test('should show error when failing to mark task as completed.', async () => {
  fetchMock.post('/api/markComplete', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('complete-task-button')); });

  expect(fetchMock.calls('/api/markComplete')).toHaveLength(1);
  expect(screen.getByText('Failed to mark task as completed.')).toBeInTheDocument();
}, 10000);
