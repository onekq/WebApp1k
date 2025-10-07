import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './discussionForumParticipation_trackPeerReviewProgress_certificateGeneration_unenrollFromCourse';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully posts a new forum post (from discussionForumParticipation_trackPeerReviewProgress)', async () => {
  fetchMock.post('/forum/posts', { status: 201 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('post-content'), { target: { value: 'New post' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post successful')).toBeInTheDocument();
}, 10000);

test('Fails to post a new forum post (from discussionForumParticipation_trackPeerReviewProgress)', async () => {
  fetchMock.post('/forum/posts', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('post-content'), { target: { value: 'New post' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Posting failed')).toBeInTheDocument();
}, 10000);

test('Peer review progress is tracked successfully. (from discussionForumParticipation_trackPeerReviewProgress)', async () => {
  fetchMock.get('/api/peer-review-progress/101', { progress: 'Reviewed' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Peer Review/i)); });

  expect(fetchMock.calls('/api/peer-review-progress/101').length).toEqual(1);
  expect(screen.getByText(/Progress: Reviewed/i)).toBeInTheDocument();
}, 10000);

test('Peer review progress tracking fails if the server returns an error. (from discussionForumParticipation_trackPeerReviewProgress)', async () => {
  fetchMock.get('/api/peer-review-progress/101', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Peer Review/i)); });

  expect(fetchMock.calls('/api/peer-review-progress/101').length).toEqual(1);
  expect(screen.getByText(/Failed to track peer review progress/i)).toBeInTheDocument();
}, 10000);

test('Certificate is generated upon course completion. (from certificateGeneration_unenrollFromCourse)', async () => {
  fetchMock.post('/api/course/complete', { certificateUrl: '/certificates/1' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/complete course/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/download certificate/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when certificate generation fails. (from certificateGeneration_unenrollFromCourse)', async () => {
  fetchMock.post('/api/course/complete', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/complete course/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to generate certificate/i)).toBeInTheDocument();
}, 10000);

test('Users can successfully unenroll from a course. (from certificateGeneration_unenrollFromCourse)', async () => {
  fetchMock.delete('/api/unenroll/101', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Unenroll from Course/i)); });

  expect(fetchMock.calls('/api/unenroll/101').length).toEqual(1);
  expect(screen.getByText(/Unenrolled successfully/i)).toBeInTheDocument();
}, 10000);

test('Users cannot unenroll from a course if the server returns an error. (from certificateGeneration_unenrollFromCourse)', async () => {
  fetchMock.delete('/api/unenroll/101', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Unenroll from Course/i)); });

  expect(fetchMock.calls('/api/unenroll/101').length).toEqual(1);
  expect(screen.getByText(/Failed to unenroll/i)).toBeInTheDocument();
}, 10000);

