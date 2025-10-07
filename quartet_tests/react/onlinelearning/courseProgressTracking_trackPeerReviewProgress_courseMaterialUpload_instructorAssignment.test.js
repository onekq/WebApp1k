import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseProgressTracking_trackPeerReviewProgress_courseMaterialUpload_instructorAssignment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('The system correctly tracks course progress. (from courseProgressTracking_trackPeerReviewProgress)', async () => {
  fetchMock.get('/api/course-progress/101', { progress: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Progress/i)); });

  expect(fetchMock.calls('/api/course-progress/101').length).toEqual(1);
  expect(screen.getByText(/Progress: 50%/i)).toBeInTheDocument();
}, 10000);

test('Course progress tracking fails with an error response from the server. (from courseProgressTracking_trackPeerReviewProgress)', async () => {
  fetchMock.get('/api/course-progress/101', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Progress/i)); });

  expect(fetchMock.calls('/api/course-progress/101').length).toEqual(1);
  expect(screen.getByText(/Failed to load progress/i)).toBeInTheDocument();
}, 10000);

test('Peer review progress is tracked successfully. (from courseProgressTracking_trackPeerReviewProgress)', async () => {
  fetchMock.get('/api/peer-review-progress/101', { progress: 'Reviewed' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Peer Review/i)); });

  expect(fetchMock.calls('/api/peer-review-progress/101').length).toEqual(1);
  expect(screen.getByText(/Progress: Reviewed/i)).toBeInTheDocument();
}, 10000);

test('Peer review progress tracking fails if the server returns an error. (from courseProgressTracking_trackPeerReviewProgress)', async () => {
  fetchMock.get('/api/peer-review-progress/101', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Peer Review/i)); });

  expect(fetchMock.calls('/api/peer-review-progress/101').length).toEqual(1);
  expect(screen.getByText(/Failed to track peer review progress/i)).toBeInTheDocument();
}, 10000);

test('Success: instructor uploads course material (from courseMaterialUpload_instructorAssignment)', async () => {
  fetchMock.post('/api/upload', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('upload-file'), { target: { files: ['file'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Material uploaded successfully')).toBeInTheDocument();
}, 10000);

test('Failure: course material upload fails (from courseMaterialUpload_instructorAssignment)', async () => {
  fetchMock.post('/api/upload', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('upload-file'), { target: { files: ['file'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Material upload failed')).toBeInTheDocument();
}, 10000);

test('Instructor Assignment success: should display assigned instructor. (from courseMaterialUpload_instructorAssignment)', async () => {
  fetchMock.post('/api/assign-instructor', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Instructor ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Instructor successfully assigned.')).toBeInTheDocument();
}, 10000);

test('Instructor Assignment failure: should display an error message on assignment failure. (from courseMaterialUpload_instructorAssignment)', async () => {
  fetchMock.post('/api/assign-instructor', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Instructor ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to assign instructor.')).toBeInTheDocument();
}, 10000);

