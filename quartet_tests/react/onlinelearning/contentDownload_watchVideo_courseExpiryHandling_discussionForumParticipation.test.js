import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentDownload_watchVideo_courseExpiryHandling_discussionForumParticipation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: content downloaded successfully (from contentDownload_watchVideo)', async () => {
  fetchMock.get('/api/download', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('download-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content downloaded successfully')).toBeInTheDocument();
}, 10000);

test('Failure: content download fails (from contentDownload_watchVideo)', async () => {
  fetchMock.get('/api/download', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('download-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content download failed')).toBeInTheDocument();
}, 10000);

test('Success: video plays successfully (from contentDownload_watchVideo)', async () => {
  fetchMock.get('/api/video', 200);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('play-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('video-player')).toBeInTheDocument();
}, 10000);

test('Failure: video fails to play (from contentDownload_watchVideo)', async () => {
  fetchMock.get('/api/video', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('play-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error playing video')).toBeInTheDocument();
}, 10000);

test('Successfully handles course expiry and re-enrollment (from courseExpiryHandling_discussionForumParticipation)', async () => {
  fetchMock.post('/courses/expire', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Re-enroll')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Re-enrollment successful')).toBeInTheDocument();
}, 10000);

test('Fails to handle course expiry and re-enrollment (from courseExpiryHandling_discussionForumParticipation)', async () => {
  fetchMock.post('/courses/expire', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Re-enroll')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Re-enrollment failed')).toBeInTheDocument();
}, 10000);

test('Successfully posts a new forum post (from courseExpiryHandling_discussionForumParticipation)', async () => {
  fetchMock.post('/forum/posts', { status: 201 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('post-content'), { target: { value: 'New post' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post successful')).toBeInTheDocument();
}, 10000);

test('Fails to post a new forum post (from courseExpiryHandling_discussionForumParticipation)', async () => {
  fetchMock.post('/forum/posts', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('post-content'), { target: { value: 'New post' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Posting failed')).toBeInTheDocument();
}, 10000);

