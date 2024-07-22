import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './exportDataToCsv';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should export fitness data to CSV successfully.', async () => {
  fetchMock.get('/api/data/export', { status: 200, body: 'csv-data' });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/data/export')).toBe(true);
  expect(screen.getByText('Data exported successfully!')).toBeInTheDocument();
}, 10000);

test('should fail to export fitness data to CSV.', async () => {
  fetchMock.get('/api/data/export', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('export-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(fetchMock.called('/api/data/export')).toBe(true);
  expect(screen.getByText('Export failed.')).toBeInTheDocument();
}, 10000);

