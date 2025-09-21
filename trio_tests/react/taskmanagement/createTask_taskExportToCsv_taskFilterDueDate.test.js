import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createTask_taskExportToCsv_taskFilterDueDate';

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

test('Filter tasks by due date successfully.', async () => {
  fetchMock.get('/api/tasks?dueDate=2023-10-10', {
    tasks: [{ id: 2, title: 'Task 2', dueDate: '2023-10-10' }],
  });

  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by due date'), { target: { value: '2023-10-10' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Task 2')).toBeInTheDocument();
}, 10000);

test('Fail to filter tasks by due date when API returns 500.', async () => {
  fetchMock.get('/api/tasks?dueDate=2023-10-10', 500);
  
  await act(async () => {
    render(<MemoryRouter><TaskList /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Filter by due date'), { target: { value: '2023-10-10' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Apply Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to filter tasks.')).toBeInTheDocument();
}, 10000);
