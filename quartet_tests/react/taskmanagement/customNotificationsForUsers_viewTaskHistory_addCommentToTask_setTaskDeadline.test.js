import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customNotificationsForUsers_viewTaskHistory_addCommentToTask_setTaskDeadline';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Set custom notification preferences successfully (from customNotificationsForUsers_viewTaskHistory)', async () => {
  fetchMock.post('/set-notifications', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-checkbox')); });

  expect(fetchMock.calls('/set-notifications').length).toBe(1);
  expect(screen.getByText('Notifications set successfully')).toBeInTheDocument();
}, 10000);

test('Fail to set custom notification preferences due to server error (from customNotificationsForUsers_viewTaskHistory)', async () => {
  fetchMock.post('/set-notifications', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('notifications-checkbox')); });

  expect(fetchMock.calls('/set-notifications').length).toBe(1);
  expect(screen.getByText('Error setting notifications')).toBeInTheDocument();
}, 10000);

test('View change history of a task successfully. (from customNotificationsForUsers_viewTaskHistory)', async () => {
  fetchMock.get('/api/tasks/1/history', {
    history: [{ change: 'Changed status to completed' }],
  });

  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Changed status to completed')).toBeInTheDocument();
}, 10000);

test('Fail to view change history of a task when API returns 500. (from customNotificationsForUsers_viewTaskHistory)', async () => {
  fetchMock.get('/api/tasks/1/history', 500);
  
  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load history.')).toBeInTheDocument();
}, 10000);

test('should add a comment to task successfully. (from addCommentToTask_setTaskDeadline)', async () => {
  fetchMock.post('/api/addComment', { status: 200, body: { taskId: 1, comment: 'New comment' }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'New comment' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Comment')); });

  expect(fetchMock.calls('/api/addComment')).toHaveLength(1);
  expect(screen.getByText('Comment added!')).toBeInTheDocument();
}, 10000);

test('should display error when adding comment fails. (from addCommentToTask_setTaskDeadline)', async () => {
  fetchMock.post('/api/addComment', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Add Comment')); });

  expect(fetchMock.calls('/api/addComment')).toHaveLength(1);
  expect(screen.getByText('Failed to add comment.')).toBeInTheDocument();
}, 10000);

test('Set a due date for a task successfully. (from addCommentToTask_setTaskDeadline)', async () => {
  fetchMock.post('/api/tasks/1/deadline', {
    task: { id: 1, title: 'Task 1', dueDate: '2023-10-10' },
  });

  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Set deadline'), { target: { value: '2023-10-10' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Deadline'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2023-10-10')).toBeInTheDocument();
}, 10000);

test('Fail to set a due date for a task when API returns 500. (from addCommentToTask_setTaskDeadline)', async () => {
  fetchMock.post('/api/tasks/1/deadline', 500);
  
  await act(async () => {
    render(<MemoryRouter><App taskId={1} /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Set deadline'), { target: { value: '2023-10-10' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Deadline'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to set deadline.')).toBeInTheDocument();
}, 10000);

