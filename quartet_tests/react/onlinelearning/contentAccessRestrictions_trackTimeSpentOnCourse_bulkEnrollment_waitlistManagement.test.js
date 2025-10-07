import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentAccessRestrictions_trackTimeSpentOnCourse_bulkEnrollment_waitlistManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Content Access Restrictions success: should display restricted content. (from contentAccessRestrictions_trackTimeSpentOnCourse)', async () => {
  fetchMock.get('/api/courses/1/content', { id: 1, title: 'Protected Content' });

  await act(async () => { render(<MemoryRouter><App courseId={1} permission="admin" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Protected Content')).toBeInTheDocument();
}, 10000);

test('Content Access Restrictions failure: should display an error message on unauthorized access. (from contentAccessRestrictions_trackTimeSpentOnCourse)', async () => {
  fetchMock.get('/api/courses/1/content', 403);

  await act(async () => { render(<MemoryRouter><App courseId={1} permission="guest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Access restricted.')).toBeInTheDocument();
}, 10000);

test('Time spent on course content is recorded successfully. (from contentAccessRestrictions_trackTimeSpentOnCourse)', async () => {
  fetchMock.get('/api/time-spent/101', { timeSpent: '5 hours' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Time Spent/i)); });

  expect(fetchMock.calls('/api/time-spent/101').length).toEqual(1);
  expect(screen.getByText(/Time Spent: 5 hours/i)).toBeInTheDocument();
}, 10000);

test('Time spent on course content tracking fails if the server returns an error. (from contentAccessRestrictions_trackTimeSpentOnCourse)', async () => {
  fetchMock.get('/api/time-spent/101', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Time Spent/i)); });

  expect(fetchMock.calls('/api/time-spent/101').length).toEqual(1);
  expect(screen.getByText(/Failed to track time spent/i)).toBeInTheDocument();
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

