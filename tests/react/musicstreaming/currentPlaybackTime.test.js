import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PlaybackComponent from './currentPlaybackTime';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('The current playback time is updated accurately.', async () => {
  fetchMock.get('/api/playbackTime', { currentTime: '1:23' });

  await act(async () => { render(<MemoryRouter><PlaybackComponent /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('1:23')).toBeInTheDocument();
}, 10000);

test('The current playback time fails to update with an error message.', async () => {
  fetchMock.get('/api/playbackTime', 500);

  await act(async () => { render(<MemoryRouter><PlaybackComponent /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error updating playback time')).toBeInTheDocument();
}, 10000);

