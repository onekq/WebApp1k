import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CSVImportExport from './taskImportFromCsv';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

