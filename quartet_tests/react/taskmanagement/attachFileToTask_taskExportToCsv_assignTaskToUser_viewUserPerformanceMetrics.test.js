import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attachFileToTask_taskExportToCsv_assignTaskToUser_viewUserPerformanceMetrics';

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

test('Assign task to user successfully (from assignTaskToUser_viewUserPerformanceMetrics)', async () => {
  fetchMock.post('/assign-task', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'New Task' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('assign-task-button')); });

  expect(fetchMock.calls('/assign-task').length).toBe(1);
  expect(screen.getByText('Task assigned successfully')).toBeInTheDocument();
}, 10000);

test('Fail to assign task due to server error (from assignTaskToUser_viewUserPerformanceMetrics)', async () => {
  fetchMock.post('/assign-task', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-input'), { target: { value: 'New Task' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('assign-task-button')); });

  expect(fetchMock.calls('/assign-task').length).toBe(1);
  expect(screen.getByText('Error assigning task')).toBeInTheDocument();
}, 10000);

test('View user performance metrics successfully (from assignTaskToUser_viewUserPerformanceMetrics)', async () => {
  fetchMock.get('/user-performance?user=User1', { status: 200, body: { metrics: { tasksCompleted: 5 } } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-metrics-button')); });

  expect(fetchMock.calls('/user-performance?user=User1').length).toBe(1);
  expect(screen.getByText('Tasks completed: 5')).toBeInTheDocument();
}, 10000);

test('Fail to view user performance metrics due to server error (from assignTaskToUser_viewUserPerformanceMetrics)', async () => {
  fetchMock.get('/user-performance?user=User1', { status: 500, body: { metrics: null } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('view-metrics-button')); });

  expect(fetchMock.calls('/user-performance?user=User1').length).toBe(1);
  expect(screen.getByText('Error fetching performance metrics')).toBeInTheDocument();
}, 10000);

