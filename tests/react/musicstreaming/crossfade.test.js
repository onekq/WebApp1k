import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './crossfade';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Crossfade - success shows crossfade activated message', async () => {
  fetchMock.post('/api/crossfade', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Crossfade')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Crossfade activated')).toBeInTheDocument();
}, 10000);

test('Crossfade - failure shows error message', async () => {
  fetchMock.post('/api/crossfade', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Crossfade')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to activate crossfade')).toBeInTheDocument();
}, 10000);

