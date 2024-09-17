import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './downloadPhoto_photoUploadLimit';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('downloads a photo successfully', async () => {
  fetchMock.get('/download/1', { status: 200, body: 'image binary data' });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('download-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/photo downloaded/i)).toBeInTheDocument();
}, 10000);

test('fails to download a photo', async () => {
  fetchMock.get('/download/1', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('download-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/download failed/i)).toBeInTheDocument();
}, 10000);

test('adheres to photo upload size limit', async () => {
  fetchMock.post('/upload', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    const file = new File(['a'.repeat(2 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('upload-success-message')).toBeInTheDocument();
}, 10000);

test('fails when photo exceeds size limit', async () => {
  fetchMock.post('/upload', { status: 413 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    const file = new File(['a'.repeat(7 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/file too large/i)).toBeInTheDocument();
}, 10000);