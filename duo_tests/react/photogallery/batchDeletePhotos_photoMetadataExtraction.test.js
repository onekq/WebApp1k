import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './batchDeletePhotos_photoMetadataExtraction';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('batch deletes multiple photos successfully', async () => {
  fetchMock.delete('/photos', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-selected-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/photos deleted/i)).toBeInTheDocument();
}, 10000);

test('fails to batch delete multiple photos', async () => {
  fetchMock.delete('/photos', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-selected-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/batch delete failed/i)).toBeInTheDocument();
}, 10000);

test('extracts photo metadata correctly', async () => {
  fetchMock.post('/upload', { status: 200, body: { metadata: { date: '2021-01-01', location: 'Paris' } } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [new File(['dummy content'], 'example.png', { type: 'image/png' })] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Date: 2021-01-01/)).toBeInTheDocument();
  expect(screen.getByText(/Location: Paris/)).toBeInTheDocument();
}, 10000);

test('fails to extract photo metadata', async () => {
  fetchMock.post('/upload', { status: 200, body: {} });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [new File(['dummy content'], 'example.png', { type: 'image/png' })] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/metadata extraction failed/i)).toBeInTheDocument();
}, 10000);