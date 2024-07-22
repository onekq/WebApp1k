import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import BulkUploadForm from './bulkProductUpload';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Bulk product upload succeeds.', async () => {
  fetchMock.post('/api/bulk-upload', { status: 200, body: { message: 'Bulk upload successful' } });

  await act(async () => { render(<MemoryRouter><BulkUploadForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('CSV File'), { target: { files: [new File([''], 'sample.csv')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Upload')); });

  expect(fetchMock.calls('/api/bulk-upload').length).toBe(1);
  expect(screen.getByText('Bulk upload successful')).toBeInTheDocument();
}, 10000);

test('Bulk product upload fails with error message.', async () => {
  fetchMock.post('/api/bulk-upload', { status: 400, body: { message: 'Invalid file format' } });

  await act(async () => { render(<MemoryRouter><BulkUploadForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('CSV File'), { target: { files: [new File([''], 'invalid_file.txt')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Upload')); });

  expect(fetchMock.calls('/api/bulk-upload').length).toBe(1);
  expect(screen.getByText('Invalid file format')).toBeInTheDocument();
}, 10000);

