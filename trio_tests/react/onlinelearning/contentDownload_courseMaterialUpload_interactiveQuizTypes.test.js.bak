import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentDownload_courseMaterialUpload_interactiveQuizTypes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Success: content downloaded successfully', async () => {
  fetchMock.get('/api/download', 200);

  await act(async () => { render(<MemoryRouter><ContentDownloadComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('download-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content downloaded successfully')).toBeInTheDocument();
}, 10000);

test('Failure: content download fails', async () => {
  fetchMock.get('/api/download', 500);

  await act(async () => { render(<MemoryRouter><ContentDownloadComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('download-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content download failed')).toBeInTheDocument();
}, 10000);

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

test('Success: multiple choice quiz functions correctly', async () => {
  fetchMock.get('/api/multiple-choice-quiz', 200);

  await act(async () => { render(<MemoryRouter><InteractiveQuizTypesComponent /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('start-multiple-choice-quiz')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Multiple choice quiz loaded')).toBeInTheDocument();
}, 10000);

test('Failure: multiple choice quiz fails to load', async () => {
  fetchMock.get('/api/multiple-choice-quiz', 500);

  await act(async () => { render(<MemoryRouter><InteractiveQuizTypesComponent /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('start-multiple-choice-quiz')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading multiple choice quiz')).toBeInTheDocument();
}, 10000);
