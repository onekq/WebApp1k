import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './pauseSong';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Pause Song - success shows playback paused message', async () => {
  fetchMock.post('/api/pause-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pause Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playback paused')).toBeInTheDocument();
}, 10000);

test('Pause Song - failure shows error message', async () => {
  fetchMock.post('/api/pause-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Pause Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to pause playback')).toBeInTheDocument();
}, 10000);

