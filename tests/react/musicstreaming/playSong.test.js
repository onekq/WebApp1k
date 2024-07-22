import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './playSong';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Play Song - success shows playback started message', async () => {
  fetchMock.post('/api/play-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Play Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Playback started')).toBeInTheDocument();
}, 10000);

test('Play Song - failure shows error message', async () => {
  fetchMock.post('/api/play-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Play Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to start playback')).toBeInTheDocument();
}, 10000);

