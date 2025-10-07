import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setTaskDeadline_setUserRoles_attachFileToTask_taskExportToCsv';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Set a due date for a task successfully. (from setTaskDeadline_setUserRoles)', async () => {
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

test('Fail to set a due date for a task when API returns 500. (from setTaskDeadline_setUserRoles)', async () => {
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

test('Set user roles successfully (from setTaskDeadline_setUserRoles)', async () => {
  fetchMock.post('/set-user-roles', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('role-manager-button')); });

  expect(fetchMock.calls('/set-user-roles').length).toBe(1);
  expect(screen.getByText('Role assigned successfully')).toBeInTheDocument();
}, 10000);

test('Fail to set user roles due to server error (from setTaskDeadline_setUserRoles)', async () => {
  fetchMock.post('/set-user-roles', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('role-manager-button')); });

  expect(fetchMock.calls('/set-user-roles').length).toBe(1);
  expect(screen.getByText('Error assigning role')).toBeInTheDocument();
}, 10000);

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

