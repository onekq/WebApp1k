import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './assignmentSubmission_courseRecommendation_liveSessionAttendance';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Success: assignment submitted successfully', async () => {
  fetchMock.post('/api/assignment', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('assignment-text'), { target: { value: 'assignment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Assignment submitted successfully')).toBeInTheDocument();
}, 10000);

test('Failure: assignment submission fails', async () => {
  fetchMock.post('/api/assignment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('assignment-text'), { target: { value: 'assignment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Assignment submission failed')).toBeInTheDocument();
}, 10000);

test('Successfully displays course recommendations', async () => {
  fetchMock.get('/course-recommendations', { status: 200, body: [{ id: 1, title: 'Course 1' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course 1')).toBeInTheDocument();
}, 10000);

test('Fails to display course recommendations', async () => {
  fetchMock.get('/course-recommendations', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recommendations failed')).toBeInTheDocument();
}, 10000);

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
