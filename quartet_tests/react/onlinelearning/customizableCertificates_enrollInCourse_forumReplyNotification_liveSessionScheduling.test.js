import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customizableCertificates_enrollInCourse_forumReplyNotification_liveSessionScheduling';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Certificate templates are customizable. (from customizableCertificates_enrollInCourse)', async () => {
  fetchMock.post('/api/certificates/customize', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/template/i), { target: { value: 'new template' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/saved successfully/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when customization fails. (from customizableCertificates_enrollInCourse)', async () => {
  fetchMock.post('/api/certificates/customize', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/template/i), { target: { value: 'invalid template' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
}, 10000);

test('Users can successfully enroll in a course. (from customizableCertificates_enrollInCourse)', async () => {
  fetchMock.post('/api/enroll', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Course ID/i), { target: { value: '101' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(1);
  expect(screen.getByText(/Enrolled successfully/i)).toBeInTheDocument();
}, 10000);

test('Users cannot enroll in a course if the server returns an error. (from customizableCertificates_enrollInCourse)', async () => {
  fetchMock.post('/api/enroll', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Course ID/i), { target: { value: '101' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(1);
  expect(screen.getByText(/Failed to enroll/i)).toBeInTheDocument();
}, 10000);

test('Successfully sends a forum reply notification (from forumReplyNotification_liveSessionScheduling)', async () => {
  fetchMock.post('/forum/reply-notifications', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Reply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification sent')).toBeInTheDocument();
}, 10000);

test('Fails to send a forum reply notification (from forumReplyNotification_liveSessionScheduling)', async () => {
  fetchMock.post('/forum/reply-notifications', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Reply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification failed')).toBeInTheDocument();
}, 10000);

test('Successfully schedules and notifies for live session (from forumReplyNotification_liveSessionScheduling)', async () => {
  fetchMock.post('/live-sessions/schedule', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Session scheduled')).toBeInTheDocument();
}, 10000);

test('Fails to schedule and notify for live session (from forumReplyNotification_liveSessionScheduling)', async () => {
  fetchMock.post('/live-sessions/schedule', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Scheduling failed')).toBeInTheDocument();
}, 10000);

