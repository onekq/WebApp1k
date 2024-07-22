import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ContentDownloadComponent from './contentDownload';

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

