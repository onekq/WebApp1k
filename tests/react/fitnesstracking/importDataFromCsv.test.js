import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './importDataFromCsv';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should import fitness data from CSV successfully.', async () => {
  fetchMock.post('/api/data/import', { status: 200 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('import-input'), { target: { value: 'csv-file-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('import-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/data/import')).toBe(true);
  expect(screen.getByText('Data imported successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to import fitness data from CSV.', async () => {
  fetchMock.post('/api/data/import', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('import-input'), { target: { value: 'csv-file-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('import-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/data/import')).toBe(true);
  expect(screen.getByText('Import failed.')).toBeInTheDocument();
}, 10000);

