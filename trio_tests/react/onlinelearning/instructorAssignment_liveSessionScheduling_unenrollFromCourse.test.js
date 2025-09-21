import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './instructorAssignment_liveSessionScheduling_unenrollFromCourse';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Instructor Assignment success: should display assigned instructor.', async () => {
  fetchMock.post('/api/assign-instructor', { success: true });

  await act(async () => { render(<MemoryRouter><InstructorAssignment /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Instructor ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Instructor successfully assigned.')).toBeInTheDocument();
}, 10000);

test('Instructor Assignment failure: should display an error message on assignment failure.', async () => {
  fetchMock.post('/api/assign-instructor', 400);

  await act(async () => { render(<MemoryRouter><InstructorAssignment /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Instructor ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to assign instructor.')).toBeInTheDocument();
}, 10000);

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

test('Users can successfully unenroll from a course.', async () => {
  fetchMock.delete('/api/unenroll/101', 200);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Unenroll from Course/i)); });

  expect(fetchMock.calls('/api/unenroll/101').length).toEqual(1);
  expect(screen.getByText(/Unenrolled successfully/i)).toBeInTheDocument();
}, 10000);

test('Users cannot unenroll from a course if the server returns an error.', async () => {
  fetchMock.delete('/api/unenroll/101', 400);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Unenroll from Course/i)); });

  expect(fetchMock.calls('/api/unenroll/101').length).toEqual(1);
  expect(screen.getByText(/Failed to unenroll/i)).toBeInTheDocument();
}, 10000);
