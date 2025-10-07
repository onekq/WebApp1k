import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createTask_customNotificationsForUsers_approveOrRejectTaskReview_projectCustomWorkflows';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully create a new task. (from createTask_customNotificationsForUsers)', async () => {
  fetchMock.post('/api/taskCreate', { status: 201, body: { id: 1, title: 'New Task', description: 'New task description' }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New task description' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create')); });

  expect(fetchMock.calls('/api/taskCreate')).toHaveLength(1);
  expect(screen.getByText('Task created successfully!')).toBeInTheDocument();
}, 10000);

test('should show error message when failing to create a task. (from createTask_customNotificationsForUsers)', async () => {
  fetchMock.post('/api/taskCreate', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: '' } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Description'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create')); });

  expect(fetchMock.calls('/api/taskCreate')).toHaveLength(1);
  expect(screen.getByText('Failed to create task.')).toBeInTheDocument();
}, 10000);

test('Set custom notification preferences successfully (from createTask_customNotificationsForUsers)', async () => {
  fetchMock.post('/set-notifications', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-checkbox')); });

  expect(fetchMock.calls('/set-notifications').length).toBe(1);
  expect(screen.getByText('Notifications set successfully')).toBeInTheDocument();
}, 10000);

test('Fail to set custom notification preferences due to server error (from createTask_customNotificationsForUsers)', async () => {
  fetchMock.post('/set-notifications', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-checkbox')); });

  expect(fetchMock.calls('/set-notifications').length).toBe(1);
  expect(screen.getByText('Error setting notifications')).toBeInTheDocument();
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

