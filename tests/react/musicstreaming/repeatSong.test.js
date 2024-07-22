import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './repeatSong';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Repeat Song - success shows repeat song mode activated message', async () => {
  fetchMock.post('/api/repeat-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Repeat Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Repeat song mode activated')).toBeInTheDocument();
}, 10000);

test('Repeat Song - failure shows error message', async () => {
  fetchMock.post('/api/repeat-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Repeat Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to activate repeat song mode')).toBeInTheDocument();
}, 10000);

