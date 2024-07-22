import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyFinanceTool from './expenseImport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: Import expenses from a CSV file.', async () => {
  fetchMock.post('/api/import-csv', { status: 200, body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  const fileInput = screen.getByTestId('csv-file-input');
  const file = new File(['content'], 'expenses.csv', { type: 'text/csv' });

  await act(async () => {
    fireEvent.change(fileInput, { target: { files: [file] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('import-csv-btn'));
  });

  expect(fetchMock.calls('/api/import-csv').length).toBe(1);
  expect(screen.getByText('CSV imported successfully!')).toBeInTheDocument();
}, 10000);

test('Failure: Import expenses from a CSV file.', async () => {
  fetchMock.post('/api/import-csv', { status: 400, body: { error: 'Invalid CSV file' } });

  await act(async () => {
    render(<MemoryRouter><MyFinanceTool /></MemoryRouter>);
  });

  const fileInput = screen.getByTestId('csv-file-input');
  const file = new File(['content'], 'expenses.csv', { type: 'text/csv' });

  await act(async () => {
    fireEvent.change(fileInput, { target: { files: [file] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('import-csv-btn'));
  });

  expect(fetchMock.calls('/api/import-csv').length).toBe(1);
  expect(screen.getByText('Invalid CSV file')).toBeInTheDocument();
}, 10000);