import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import QueueComponent from './playbackQueue';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Songs are added to the playback queue correctly.', async () => {
  fetchMock.post('/api/queue', 200);

  await act(async () => { render(<MemoryRouter><QueueComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Songs fail to add to the playback queue with an error message.', async () => {
  fetchMock.post('/api/queue', 500);

  await act(async () => { render(<MemoryRouter><QueueComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-to-queue-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding song to the queue')).toBeInTheDocument();
}, 10000);

