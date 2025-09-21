import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './leaderboardDisplay_materialVersionControl_trackPeerReviewProgress';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully displays leaderboard', async () => {
  fetchMock.get('/leaderboard', { status: 200, body: [{ id: 1, leader: 'User 1' }] });

  await act(async () => { render(<MemoryRouter><LeaderboardDisplay /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('User 1')).toBeInTheDocument();
}, 10000);

test('Fails to display leaderboard', async () => {
  fetchMock.get('/leaderboard', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><LeaderboardDisplay /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Leaderboard failed')).toBeInTheDocument();
}, 10000);

test('Material Version Control success: should display version control info.', async () => {
  fetchMock.get('/api/course-materials/1/versions', [{ version: 1, details: 'Initial Version' }]);

  await act(async () => { render(<MemoryRouter><MaterialVersionControl courseId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Initial Version')).toBeInTheDocument();
}, 10000);

test('Material Version Control failure: should display an error message on version retrieval failure.', async () => {
  fetchMock.get('/api/course-materials/1/versions', 404);

  await act(async () => { render(<MemoryRouter><MaterialVersionControl courseId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Version information cannot be retrieved.')).toBeInTheDocument();
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
