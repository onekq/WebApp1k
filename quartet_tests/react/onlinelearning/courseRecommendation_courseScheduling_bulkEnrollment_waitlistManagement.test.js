import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseRecommendation_courseScheduling_bulkEnrollment_waitlistManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully displays course recommendations (from courseRecommendation_courseScheduling)', async () => {
  fetchMock.get('/course-recommendations', { status: 200, body: [{ id: 1, title: 'Course 1' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course 1')).toBeInTheDocument();
}, 10000);

test('Fails to display course recommendations (from courseRecommendation_courseScheduling)', async () => {
  fetchMock.get('/course-recommendations', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recommendations failed')).toBeInTheDocument();
}, 10000);

test('Course Scheduling success: should display scheduled courses. (from courseRecommendation_courseScheduling)', async () => {
  fetchMock.post('/api/schedule-course', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Course ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course successfully scheduled.')).toBeInTheDocument();
}, 10000);

test('Course Scheduling failure: should display an error message on schedule failure. (from courseRecommendation_courseScheduling)', async () => {
  fetchMock.post('/api/schedule-course', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Course ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to schedule course.')).toBeInTheDocument();
}, 10000);

test('Bulk enrollment is successful for organizations. (from bulkEnrollment_waitlistManagement)', async () => {
  fetchMock.post('/api/bulk-enroll', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Organization ID/i), { target: { value: 'org123' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Bulk Enroll/i)); });

  expect(fetchMock.calls('/api/bulk-enroll').length).toEqual(1);
  expect(screen.getByText(/Bulk enrollment successful/i)).toBeInTheDocument();
}, 10000);

test('Bulk enrollment fails if the server returns an error. (from bulkEnrollment_waitlistManagement)', async () => {
  fetchMock.post('/api/bulk-enroll', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Organization ID/i), { target: { value: 'org123' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Bulk Enroll/i)); });

  expect(fetchMock.calls('/api/bulk-enroll').length).toEqual(1);
  expect(screen.getByText(/Failed to enroll users in bulk/i)).toBeInTheDocument();
}, 10000);

test('Users can be successfully added to the waitlist. (from bulkEnrollment_waitlistManagement)', async () => {
  fetchMock.post('/api/waitlist', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Join Waitlist/i)); });

  expect(fetchMock.calls('/api/waitlist').length).toEqual(1);
  expect(screen.getByText(/Added to waitlist successfully/i)).toBeInTheDocument();
}, 10000);

test('Adding users to the waitlist fails with an error. (from bulkEnrollment_waitlistManagement)', async () => {
  fetchMock.post('/api/waitlist', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Join Waitlist/i)); });

  expect(fetchMock.calls('/api/waitlist').length).toEqual(1);
  expect(screen.getByText(/Failed to join waitlist/i)).toBeInTheDocument();
}, 10000);

