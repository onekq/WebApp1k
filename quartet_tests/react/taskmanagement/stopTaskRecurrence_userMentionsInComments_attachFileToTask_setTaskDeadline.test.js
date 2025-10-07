import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './stopTaskRecurrence_userMentionsInComments_attachFileToTask_setTaskDeadline';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully stops task recurrence. (from stopTaskRecurrence_userMentionsInComments)', async () => {
  fetchMock.post('/api/stop-task-recurrence', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('stop-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Recurrence stopped successfully')).toBeInTheDocument();
}, 10000);

test('fails to stop task recurrence if server error. (from stopTaskRecurrence_userMentionsInComments)', async () => {
  fetchMock.post('/api/stop-task-recurrence', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('stop-recurrence-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to stop recurrence')).toBeInTheDocument();
}, 10000);

test('Mention user in a task comment successfully (from stopTaskRecurrence_userMentionsInComments)', async () => {
  fetchMock.post('/mention-user', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Hey @User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-comment-button')); });

  expect(fetchMock.calls('/mention-user').length).toBe(1);
  expect(screen.getByText('Mention added successfully')).toBeInTheDocument();
}, 10000);

test('Fail to mention user in a task comment due to server error (from stopTaskRecurrence_userMentionsInComments)', async () => {
  fetchMock.post('/mention-user', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Hey @User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-comment-button')); });

  expect(fetchMock.calls('/mention-user').length).toBe(1);
  expect(screen.getByText('Error adding mention')).toBeInTheDocument();
}, 10000);

test('should attach a file to task successfully. (from attachFileToTask_setTaskDeadline)', async () => {
  fetchMock.post('/api/attachFile', { status: 200, body: { taskId: 1, fileUrl: 'http://example.com/file.png' }});
  const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Attach File')); });

  expect(fetchMock.calls('/api/attachFile')).toHaveLength(1);
  expect(screen.getByText('File attached successfully!')).toBeInTheDocument();
}, 10000);

test('should show error when attaching file fails. (from attachFileToTask_setTaskDeadline)', async () => {
  fetchMock.post('/api/attachFile', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-input'), { target: { files: [] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Attach File')); });

  expect(fetchMock.calls('/api/attachFile')).toHaveLength(1);
  expect(screen.getByText('Failed to attach file.')).toBeInTheDocument();
}, 10000);

test('Set a due date for a task successfully. (from attachFileToTask_setTaskDeadline)', async () => {
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

test('Fail to set a due date for a task when API returns 500. (from attachFileToTask_setTaskDeadline)', async () => {
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

