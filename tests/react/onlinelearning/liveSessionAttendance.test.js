import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import LiveSessionAttendance from './liveSessionAttendance';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully tracks attendance for live session', async () => {
  fetchMock.post('/live-sessions/attendance', { status: 200 });

  await act(async () => { render(<MemoryRouter><LiveSessionAttendance /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Mark Attendance')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Attendance marked')).toBeInTheDocument();
}, 10000);

test('Fails to track attendance for live session', async () => {
  fetchMock.post('/live-sessions/attendance', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><LiveSessionAttendance /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Mark Attendance')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Attendance marking failed')).toBeInTheDocument();
}, 10000);

