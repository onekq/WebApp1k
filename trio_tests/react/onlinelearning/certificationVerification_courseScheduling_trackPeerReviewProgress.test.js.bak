import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './certificationVerification_courseScheduling_trackPeerReviewProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Certificate is verified successfully.', async () => {
  fetchMock.post('/api/certificates/verify', { valid: true });

  await act(async () => { render(<MemoryRouter><CertificateVerification /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/certificate id/i), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/verify/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/certificate is valid/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when certificate verification fails.', async () => {
  fetchMock.post('/api/certificates/verify', { valid: false });

  await act(async () => { render(<MemoryRouter><CertificateVerification /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/certificate id/i), { target: { value: 'invalid' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/verify/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/certificate is invalid/i)).toBeInTheDocument();
}, 10000);

test('Course Scheduling success: should display scheduled courses.', async () => {
  fetchMock.post('/api/schedule-course', { success: true });

  await act(async () => { render(<MemoryRouter><CourseScheduling /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Course ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course successfully scheduled.')).toBeInTheDocument();
}, 10000);

test('Course Scheduling failure: should display an error message on schedule failure.', async () => {
  fetchMock.post('/api/schedule-course', 400);

  await act(async () => { render(<MemoryRouter><CourseScheduling /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Course ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to schedule course.')).toBeInTheDocument();
}, 10000);

test('Peer review progress is tracked successfully.', async () => {
  fetchMock.get('/api/peer-review-progress/101', { progress: 'Reviewed' });

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Peer Review/i)); });

  expect(fetchMock.calls('/api/peer-review-progress/101').length).toEqual(1);
  expect(screen.getByText(/Progress: Reviewed/i)).toBeInTheDocument();
}, 10000);

test('Peer review progress tracking fails if the server returns an error.', async () => {
  fetchMock.get('/api/peer-review-progress/101', 500);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Peer Review/i)); });

  expect(fetchMock.calls('/api/peer-review-progress/101').length).toEqual(1);
  expect(screen.getByText(/Failed to track peer review progress/i)).toBeInTheDocument();
}, 10000);
