import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './offlineMode';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully downloads songs for offline playback', async () => {
  fetchMock.post('/api/download', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('download-song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('download-success')).toBeInTheDocument();
}, 10000);

test('fails to download songs for offline playback due to network error', async () => {
  fetchMock.post('/api/download', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('download-song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to download song. Please try again.')).toBeInTheDocument();
}, 10000);

