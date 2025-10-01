import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './reopenTask_taskCalendarSync_taskImportFromCsv';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should reopen a completed task successfully.', async () => {
  fetchMock.post('/api/reopenTask', { status: 200, body: { taskId: 1, completed: false }});
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('reopen-task-button')); });

  expect(fetchMock.calls('/api/reopenTask')).toHaveLength(1);
  expect(screen.getByText('Task reopened!')).toBeInTheDocument();
}, 10000);

test('should display error when reopening task fails.', async () => {
  fetchMock.post('/api/reopenTask', { status: 400 });
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('reopen-task-button')); });

  expect(fetchMock.calls('/api/reopenTask')).toHaveLength(1);
  expect(screen.getByText('Failed to reopen task.')).toBeInTheDocument();
}, 10000);

test('successfully syncs task deadlines with an external calendar.', async () => {
  fetchMock.post('/api/calendar-sync', { success: true });

  await act(async () => { render(<MemoryRouter><CalendarSync /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-calendar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Calendar synced successfully')).toBeInTheDocument();
}, 10000);

test('fails to sync task deadlines with an external calendar if server error.', async () => {
  fetchMock.post('/api/calendar-sync', 500);

  await act(async () => { render(<MemoryRouter><CalendarSync /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-calendar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to sync calendar')).toBeInTheDocument();
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
