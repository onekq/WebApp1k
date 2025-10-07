import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customizableCertificates_userProgressExport_courseCompletionStatus_trackPeerReviewProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Certificate templates are customizable. (from customizableCertificates_userProgressExport)', async () => {
  fetchMock.post('/api/certificates/customize', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/template/i), { target: { value: 'new template' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/saved successfully/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when customization fails. (from customizableCertificates_userProgressExport)', async () => {
  fetchMock.post('/api/certificates/customize', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/template/i), { target: { value: 'invalid template' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
}, 10000);

test('Successfully exports user progress data (from customizableCertificates_userProgressExport)', async () => {
  fetchMock.get('/user-progress/export', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Export Progress')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export successful')).toBeInTheDocument();
}, 10000);

test('Fails to export user progress data (from customizableCertificates_userProgressExport)', async () => {
  fetchMock.get('/user-progress/export', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Export Progress')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export failed')).toBeInTheDocument();
}, 10000);

test('Course completion status is updated successfully. (from courseCompletionStatus_trackPeerReviewProgress)', async () => {
  fetchMock.post('/api/course-complete/101', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Complete Course/i)); });

  expect(fetchMock.calls('/api/course-complete/101').length).toEqual(1);
  expect(screen.getByText(/Course completed successfully/i)).toBeInTheDocument();
}, 10000);

test('Course completion status update fails if the server returns an error. (from courseCompletionStatus_trackPeerReviewProgress)', async () => {
  fetchMock.post('/api/course-complete/101', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Complete Course/i)); });

  expect(fetchMock.calls('/api/course-complete/101').length).toEqual(1);
  expect(screen.getByText(/Failed to complete the course/i)).toBeInTheDocument();
}, 10000);

test('Peer review progress is tracked successfully. (from courseCompletionStatus_trackPeerReviewProgress)', async () => {
  fetchMock.get('/api/peer-review-progress/101', { progress: 'Reviewed' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Peer Review/i)); });

  expect(fetchMock.calls('/api/peer-review-progress/101').length).toEqual(1);
  expect(screen.getByText(/Progress: Reviewed/i)).toBeInTheDocument();
}, 10000);

test('Peer review progress tracking fails if the server returns an error. (from courseCompletionStatus_trackPeerReviewProgress)', async () => {
  fetchMock.get('/api/peer-review-progress/101', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Peer Review/i)); });

  expect(fetchMock.calls('/api/peer-review-progress/101').length).toEqual(1);
  expect(screen.getByText(/Failed to track peer review progress/i)).toBeInTheDocument();
}, 10000);

