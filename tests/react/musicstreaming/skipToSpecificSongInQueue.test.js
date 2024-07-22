import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import QueueComponent from './skipToSpecificSongInQueue';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Skipping to a specific song in the queue works.', async () => {
  fetchMock.post('/api/skipTo', 200);

  await act(async () => { render(<MemoryRouter><QueueComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('skip-to-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Skipping to a specific song in the queue fails with an error message.', async () => {
  fetchMock.post('/api/skipTo', 500);

  await act(async () => { render(<MemoryRouter><QueueComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('skip-to-song-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error skipping to the song')).toBeInTheDocument();
}, 10000);

