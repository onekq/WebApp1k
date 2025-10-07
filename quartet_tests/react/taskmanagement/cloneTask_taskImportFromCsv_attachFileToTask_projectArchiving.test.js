import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './cloneTask_taskImportFromCsv_attachFileToTask_projectArchiving';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should clone an existing task successfully. (from cloneTask_taskImportFromCsv)', async () => {
  fetchMock.post('/api/cloneTask', { status: 200, body: { id: 3, clonedFromId: 1 }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('clone-task-button')); });

  expect(fetchMock.calls('/api/cloneTask')).toHaveLength(1);
  expect(screen.getByText('Task cloned successfully!')).toBeInTheDocument();
}, 10000);

test('should show error when cloning task fails. (from cloneTask_taskImportFromCsv)', async () => {
  fetchMock.post('/api/cloneTask', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('clone-task-button')); });

  expect(fetchMock.calls('/api/cloneTask')).toHaveLength(1);
  expect(screen.getByText('Failed to clone task.')).toBeInTheDocument();
}, 10000);

test('successfully imports tasks from a CSV file. (from cloneTask_taskImportFromCsv)', async () => {
  fetchMock.post('/api/import-tasks', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('csv-file-input'), { target: { files: [new File(['Task data'], 'tasks.csv')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('import-csv-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Tasks imported successfully')).toBeInTheDocument();
}, 10000);

test('fails to import tasks from a CSV file if server error. (from cloneTask_taskImportFromCsv)', async () => {
  fetchMock.post('/api/import-tasks', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('csv-file-input'), { target: { files: [new File(['Task data'], 'tasks.csv')] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('import-csv-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to import tasks')).toBeInTheDocument();
}, 10000);

test('should attach a file to task successfully. (from attachFileToTask_projectArchiving)', async () => {
  fetchMock.post('/api/attachFile', { status: 200, body: { taskId: 1, fileUrl: 'http://example.com/file.png' }});
  const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Attach File')); });

  expect(fetchMock.calls('/api/attachFile')).toHaveLength(1);
  expect(screen.getByText('File attached successfully!')).toBeInTheDocument();
}, 10000);

test('should show error when attaching file fails. (from attachFileToTask_projectArchiving)', async () => {
  fetchMock.post('/api/attachFile', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-input'), { target: { files: [] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Attach File')); });

  expect(fetchMock.calls('/api/attachFile')).toHaveLength(1);
  expect(screen.getByText('Failed to attach file.')).toBeInTheDocument();
}, 10000);

test('Archive Project - success (from attachFileToTask_projectArchiving)', async () => {
  fetchMock.post('/api/projects/archive', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /archive project/i }));
  });

  expect(fetchMock.calls('/api/projects/archive')).toHaveLength(1);
  expect(screen.getByText(/project archived successfully/i)).toBeInTheDocument();
}, 10000);

test('Archive Project - failure (from attachFileToTask_projectArchiving)', async () => {
  fetchMock.post('/api/projects/archive', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /archive project/i }));
  });

  expect(fetchMock.calls('/api/projects/archive')).toHaveLength(1);
  expect(screen.getByText(/failed to archive project/i)).toBeInTheDocument();
}, 10000);

