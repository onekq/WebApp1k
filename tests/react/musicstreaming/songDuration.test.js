import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SongComponent from './songDuration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('The song duration is displayed correctly.', async () => {
  fetchMock.get('/api/song/1', { duration: '3:45' });

  await act(async () => { render(<MemoryRouter><SongComponent songId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('3:45')).toBeInTheDocument();
}, 10000);

test('The song duration fails to display with an error message.', async () => {
  fetchMock.get('/api/song/1', 500);

  await act(async () => { render(<MemoryRouter><SongComponent songId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading song duration')).toBeInTheDocument();
}, 10000);

