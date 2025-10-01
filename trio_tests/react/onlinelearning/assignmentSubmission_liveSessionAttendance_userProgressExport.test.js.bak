import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './assignmentSubmission_liveSessionAttendance_userProgressExport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Success: assignment submitted successfully', async () => {
  fetchMock.post('/api/assignment', 200);

  await act(async () => { render(<MemoryRouter><AssignmentSubmissionComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('assignment-text'), { target: { value: 'assignment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Assignment submitted successfully')).toBeInTheDocument();
}, 10000);

test('Failure: assignment submission fails', async () => {
  fetchMock.post('/api/assignment', 500);

  await act(async () => { render(<MemoryRouter><AssignmentSubmissionComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('assignment-text'), { target: { value: 'assignment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Assignment submission failed')).toBeInTheDocument();
}, 10000);

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

test('Successfully exports user progress data', async () => {
  fetchMock.get('/user-progress/export', { status: 200 });

  await act(async () => { render(<MemoryRouter><UserProgressExport /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Export Progress')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export successful')).toBeInTheDocument();
}, 10000);

test('Fails to export user progress data', async () => {
  fetchMock.get('/user-progress/export', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><UserProgressExport /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Export Progress')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export failed')).toBeInTheDocument();
}, 10000);
