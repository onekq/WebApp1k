import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './requestTaskReview_taskCompletion_taskImportFromCsv';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Request a review successfully', async () => {
  fetchMock.post('/request-review', { status: 200, body: { success: true } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User2' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('request-review-button')); });

  expect(fetchMock.calls('/request-review').length).toBe(1);
  expect(screen.getByText('Review requested successfully')).toBeInTheDocument();
}, 10000);

test('Fail to request a review due to server error', async () => {
  fetchMock.post('/request-review', { status: 500, body: { success: false } });

  await act(async () => { render(<MemoryRouter><TaskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('task-select'), { target: { value: 'Task1' } }); });
  await act(async () => { fireEvent.change(screen.getByTestId('user-select'), { target: { value: 'User2' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('request-review-button')); });

  expect(fetchMock.calls('/request-review').length).toBe(1);
  expect(screen.getByText('Error requesting review')).toBeInTheDocument();
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

test('successfully imports tasks from a CSV file.', async () => {
  fetchMock.post('/api/import-tasks', { success: true });

  await act(async () => { render(<MemoryRouter><CSVImportExport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('csv-file-input'), { target: { files: [new File(['Task data'], 'tasks.csv')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('import-csv-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Tasks imported successfully')).toBeInTheDocument();
}, 10000);

test('fails to import tasks from a CSV file if server error.', async () => {
  fetchMock.post('/api/import-tasks', 500);

  await act(async () => { render(<MemoryRouter><CSVImportExport /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('csv-file-input'), { target: { files: [new File(['Task data'], 'tasks.csv')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('import-csv-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to import tasks')).toBeInTheDocument();
}, 10000);
