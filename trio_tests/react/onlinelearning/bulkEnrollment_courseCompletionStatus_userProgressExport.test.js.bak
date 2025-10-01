import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bulkEnrollment_courseCompletionStatus_userProgressExport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Bulk enrollment is successful for organizations.', async () => {
  fetchMock.post('/api/bulk-enroll', 200);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Organization ID/i), { target: { value: 'org123' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Bulk Enroll/i)); });

  expect(fetchMock.calls('/api/bulk-enroll').length).toEqual(1);
  expect(screen.getByText(/Bulk enrollment successful/i)).toBeInTheDocument();
}, 10000);

test('Bulk enrollment fails if the server returns an error.', async () => {
  fetchMock.post('/api/bulk-enroll', 400);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Organization ID/i), { target: { value: 'org123' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Bulk Enroll/i)); });

  expect(fetchMock.calls('/api/bulk-enroll').length).toEqual(1);
  expect(screen.getByText(/Failed to enroll users in bulk/i)).toBeInTheDocument();
}, 10000);

test('Course completion status is updated successfully.', async () => {
  fetchMock.post('/api/course-complete/101', 200);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Complete Course/i)); });

  expect(fetchMock.calls('/api/course-complete/101').length).toEqual(1);
  expect(screen.getByText(/Course completed successfully/i)).toBeInTheDocument();
}, 10000);

test('Course completion status update fails if the server returns an error.', async () => {
  fetchMock.post('/api/course-complete/101', 400);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Complete Course/i)); });

  expect(fetchMock.calls('/api/course-complete/101').length).toEqual(1);
  expect(screen.getByText(/Failed to complete the course/i)).toBeInTheDocument();
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
