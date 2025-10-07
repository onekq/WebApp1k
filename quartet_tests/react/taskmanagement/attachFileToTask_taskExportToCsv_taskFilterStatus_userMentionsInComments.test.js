import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attachFileToTask_taskExportToCsv_taskFilterStatus_userMentionsInComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should attach a file to task successfully. (from attachFileToTask_taskExportToCsv)', async () => {
  fetchMock.post('/api/attachFile', { status: 200, body: { taskId: 1, fileUrl: 'http://example.com/file.png' }});
  const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Attach File')); });

  expect(fetchMock.calls('/api/attachFile')).toHaveLength(1);
  expect(screen.getByText('File attached successfully!')).toBeInTheDocument();
}, 10000);

test('should show error when attaching file fails. (from attachFileToTask_taskExportToCsv)', async () => {
  fetchMock.post('/api/attachFile', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-input'), { target: { files: [] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Attach File')); });

  expect(fetchMock.calls('/api/attachFile')).toHaveLength(1);
  expect(screen.getByText('Failed to attach file.')).toBeInTheDocument();
}, 10000);

test('successfully exports tasks to a CSV file. (from attachFileToTask_taskExportToCsv)', async () => {
  fetchMock.get('/api/export-tasks', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-csv-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Tasks exported successfully')).toBeInTheDocument();
}, 10000);

test('fails to export tasks to a CSV file if server error. (from attachFileToTask_taskExportToCsv)', async () => {
  fetchMock.get('/api/export-tasks', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-csv-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to export tasks')).toBeInTheDocument();
}, 10000);

test('Filter tasks by status successfully. (from taskFilterStatus_userMentionsInComments)', async () => {
  fetchMock.get('/api/tasks?status=completed', {
    tasks: [{ id: 1, title: 'Task 1', status: 'completed' }],
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by status'), { target: { value: 'completed' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Task 1')).toBeInTheDocument();
}, 10000);

test('Fail to filter tasks by status when API returns 500. (from taskFilterStatus_userMentionsInComments)', async () => {
  fetchMock.get('/api/tasks?status=completed', 500);
  
  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by status'), { target: { value: 'completed' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter tasks.')).toBeInTheDocument();
}, 10000);

test('Mention user in a task comment successfully (from taskFilterStatus_userMentionsInComments)', async () => {
  fetchMock.post('/mention-user', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Hey @User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-comment-button')); });

  expect(fetchMock.calls('/mention-user').length).toBe(1);
  expect(screen.getByText('Mention added successfully')).toBeInTheDocument();
}, 10000);

test('Fail to mention user in a task comment due to server error (from taskFilterStatus_userMentionsInComments)', async () => {
  fetchMock.post('/mention-user', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Hey @User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-comment-button')); });

  expect(fetchMock.calls('/mention-user').length).toBe(1);
  expect(screen.getByText('Error adding mention')).toBeInTheDocument();
}, 10000);

