import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CalendarSync from './taskCalendarSync';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully syncs task deadlines with an external calendar.', async () => {
  fetchMock.post('/api/calendar-sync', { success: true });

  await act(async () => { render(<MemoryRouter><CalendarSync /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-calendar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Calendar synced successfully')).toBeInTheDocument();
}, 10000);

test('fails to sync task deadlines with an external calendar if server error.', async () => {
  fetchMock.post('/api/calendar-sync', 500);

  await act(async () => { render(<MemoryRouter><CalendarSync /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sync-calendar-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to sync calendar')).toBeInTheDocument();
}, 10000);

