import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseProgressTracking_trackPeerReviewProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('The system correctly tracks course progress.', async () => {
  fetchMock.get('/api/course-progress/101', { progress: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Progress/i)); });

  expect(fetchMock.calls('/api/course-progress/101').length).toEqual(1);
  expect(screen.getByText(/Progress: 50%/i)).toBeInTheDocument();
}, 10000);

test('Course progress tracking fails with an error response from the server.', async () => {
  fetchMock.get('/api/course-progress/101', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Progress/i)); });

  expect(fetchMock.calls('/api/course-progress/101').length).toEqual(1);
  expect(screen.getByText(/Failed to load progress/i)).toBeInTheDocument();
}, 10000);

test('Peer review progress is tracked successfully.', async () => {
  fetchMock.get('/api/peer-review-progress/101', { progress: 'Reviewed' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Peer Review/i)); });

  expect(fetchMock.calls('/api/peer-review-progress/101').length).toEqual(1);
  expect(screen.getByText(/Progress: Reviewed/i)).toBeInTheDocument();
}, 10000);

test('Peer review progress tracking fails if the server returns an error.', async () => {
  fetchMock.get('/api/peer-review-progress/101', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Peer Review/i)); });

  expect(fetchMock.calls('/api/peer-review-progress/101').length).toEqual(1);
  expect(screen.getByText(/Failed to track peer review progress/i)).toBeInTheDocument();
}, 10000);