import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './averageRatingCalculation_certificateGeneration_liveSessionAttendance';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Average rating is calculated correctly for a course.', async () => {
  fetchMock.get('/api/courses/ratings', { average: 4.5 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/average rating/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when rating calculation fails.', async () => {
  fetchMock.get('/api/courses/ratings', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to calculate average rating/i)).toBeInTheDocument();
}, 10000);

test('Certificate is generated upon course completion.', async () => {
  fetchMock.post('/api/course/complete', { certificateUrl: '/certificates/1' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/complete course/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/download certificate/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when certificate generation fails.', async () => {
  fetchMock.post('/api/course/complete', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/complete course/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to generate certificate/i)).toBeInTheDocument();
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
