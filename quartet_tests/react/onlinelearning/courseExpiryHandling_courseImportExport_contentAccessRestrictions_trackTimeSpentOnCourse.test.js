import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseExpiryHandling_courseImportExport_contentAccessRestrictions_trackTimeSpentOnCourse';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully handles course expiry and re-enrollment (from courseExpiryHandling_courseImportExport)', async () => {
  fetchMock.post('/courses/expire', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Re-enroll')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Re-enrollment successful')).toBeInTheDocument();
}, 10000);

test('Fails to handle course expiry and re-enrollment (from courseExpiryHandling_courseImportExport)', async () => {
  fetchMock.post('/courses/expire', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Re-enroll')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Re-enrollment failed')).toBeInTheDocument();
}, 10000);

test('Course Import/Export success: should display success message on course import. (from courseExpiryHandling_courseImportExport)', async () => {
  fetchMock.post('/api/import-course', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [new File([''], 'course.json')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Import Course')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course successfully imported.')).toBeInTheDocument();
}, 10000);

test('Course Import/Export failure: should display an error message on course import failure. (from courseExpiryHandling_courseImportExport)', async () => {
  fetchMock.post('/api/import-course', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [new File([''], 'course.json')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Import Course')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to import course.')).toBeInTheDocument();
}, 10000);

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

