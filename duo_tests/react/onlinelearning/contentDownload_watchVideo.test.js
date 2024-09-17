import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentDownload_watchVideo';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: content downloaded successfully', async () => {
  fetchMock.get('/api/download', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('download-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content downloaded successfully')).toBeInTheDocument();
}, 10000);

test('Failure: content download fails', async () => {
  fetchMock.get('/api/download', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('download-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content download failed')).toBeInTheDocument();
}, 10000);

test('Success: video plays successfully', async () => {
  fetchMock.get('/api/video', 200);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('play-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('video-player')).toBeInTheDocument();
}, 10000);

test('Failure: video fails to play', async () => {
  fetchMock.get('/api/video', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('play-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error playing video')).toBeInTheDocument();
}, 10000);