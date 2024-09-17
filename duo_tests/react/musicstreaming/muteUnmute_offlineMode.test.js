import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './muteUnmute_offlineMode';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Mute/Unmute - success shows mute/unmute toggled message', async () => {
  fetchMock.post('/api/toggle-mute', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Mute/Unmute')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Mute/Unmute toggled')).toBeInTheDocument();
}, 10000);

test('Mute/Unmute - failure shows error message', async () => {
  fetchMock.post('/api/toggle-mute', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Mute/Unmute')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to toggle mute/unmute')).toBeInTheDocument();
}, 10000);

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