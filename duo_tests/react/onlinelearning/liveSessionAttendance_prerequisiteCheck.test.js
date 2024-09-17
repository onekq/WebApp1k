import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './liveSessionAttendance_prerequisiteCheck';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully tracks attendance for live session', async () => {
  fetchMock.post('/live-sessions/attendance', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Mark Attendance')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Attendance marked')).toBeInTheDocument();
}, 10000);

test('Fails to track attendance for live session', async () => {
  fetchMock.post('/live-sessions/attendance', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Mark Attendance')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Attendance marking failed')).toBeInTheDocument();
}, 10000);

test('Enrollment is allowed after prerequisites are met.', async () => {
  fetchMock.get('/api/check-prerequisites/101', { prerequisitesMet: true });
  fetchMock.post('/api/enroll', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Check Prerequisites/i)); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(1);
  expect(screen.getByText(/Enrolled successfully/i)).toBeInTheDocument();
}, 10000);

test('Enrollment is blocked if prerequisites are not met.', async () => {
  fetchMock.get('/api/check-prerequisites/101', { prerequisitesMet: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Check Prerequisites/i)); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(0);
  expect(screen.getByText(/Cannot enroll, prerequisites not met/i)).toBeInTheDocument();
}, 10000);