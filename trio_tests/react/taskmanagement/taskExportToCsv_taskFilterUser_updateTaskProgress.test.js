import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './taskExportToCsv_taskFilterUser_updateTaskProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully exports tasks to a CSV file.', async () => {
  fetchMock.get('/api/export-tasks', { success: true });

  await act(async () => { render(<MemoryRouter><CSVImportExport /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-csv-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Tasks exported successfully')).toBeInTheDocument();
}, 10000);

test('fails to export tasks to a CSV file if server error.', async () => {
  fetchMock.get('/api/export-tasks', 500);

  await act(async () => { render(<MemoryRouter><CSVImportExport /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-csv-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to export tasks')).toBeInTheDocument();
}, 10000);

test('Filter tasks by assigned user successfully.', async () => {
  fetchMock.get('/api/tasks?assignedUser=user1', {
    tasks: [{ id: 3, title: 'Task 3', assignedUser: 'user1' }],
  });

  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by assigned user'), { target: { value: 'user1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Task 3')).toBeInTheDocument();
}, 10000);

test('Fail to filter tasks by assigned user when API returns 500.', async () => {
  fetchMock.get('/api/tasks?assignedUser=user1', 500);
  
  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by assigned user'), { target: { value: 'user1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter tasks.')).toBeInTheDocument();
}, 10000);

test('should update task progress successfully.', async () => {
  fetchMock.post('/api/updateProgress', { status: 200, body: { taskId: 1, progress: 50 }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('progress-input'), { target: { value: 50 } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Progress')); });

  expect(fetchMock.calls('/api/updateProgress')).toHaveLength(1);
  expect(screen.getByText('Task progress updated!')).toBeInTheDocument();
}, 10000);

test('should show error when updating progress fails.', async () => {
  fetchMock.post('/api/updateProgress', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('progress-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Progress')); });

  expect(fetchMock.calls('/api/updateProgress')).toHaveLength(1);
  expect(screen.getByText('Failed to update task progress.')).toBeInTheDocument();
}, 10000);
