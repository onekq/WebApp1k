import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import LiveSessionScheduling from './liveSessionScheduling';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully schedules and notifies for live session', async () => {
  fetchMock.post('/live-sessions/schedule', { status: 200 });

  await act(async () => { render(<MemoryRouter><LiveSessionScheduling /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Session scheduled')).toBeInTheDocument();
}, 10000);

test('Fails to schedule and notify for live session', async () => {
  fetchMock.post('/live-sessions/schedule', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><LiveSessionScheduling /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Scheduling failed')).toBeInTheDocument();
}, 10000);

