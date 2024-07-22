import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CourseMaterialUploadComponent from './courseMaterialUpload';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: instructor uploads course material', async () => {
  fetchMock.post('/api/upload', 200);

  await act(async () => { render(<MemoryRouter><CourseMaterialUploadComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('upload-file'), { target: { files: ['file'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Material uploaded successfully')).toBeInTheDocument();
}, 10000);

test('Failure: course material upload fails', async () => {
  fetchMock.post('/api/upload', 500);

  await act(async () => { render(<MemoryRouter><CourseMaterialUploadComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('upload-file'), { target: { files: ['file'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Material upload failed')).toBeInTheDocument();
}, 10000);