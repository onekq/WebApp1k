import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './nextSong';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Next Song - success shows next song started message', async () => {
  fetchMock.post('/api/next-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Next Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Next song started')).toBeInTheDocument();
}, 10000);

test('Next Song - failure shows error message', async () => {
  fetchMock.post('/api/next-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Next Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to skip to next song')).toBeInTheDocument();
}, 10000);

