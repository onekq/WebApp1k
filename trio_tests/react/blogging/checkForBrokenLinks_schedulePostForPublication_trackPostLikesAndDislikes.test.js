import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './checkForBrokenLinks_schedulePostForPublication_trackPostLikesAndDislikes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully checks for broken links in a blog post', async () => {
  fetchMock.post('/api/check-broken-links', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/check for broken links/i)); });

  expect(fetchMock.calls('/api/check-broken-links').length).toBe(1);
  expect(screen.getByText(/broken links checked successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to check for broken links in a blog post due to server error', async () => {
  fetchMock.post('/api/check-broken-links', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/check for broken links/i)); });

  expect(fetchMock.calls('/api/check-broken-links').length).toBe(1);
  expect(screen.getByText(/failed to check for broken links/i)).toBeInTheDocument();
}, 10000);

test('Success: schedule a post for future publication', async () => {
  fetchMock.post('/api/schedulePost', { status: 200, body: { id: 1, title: 'Scheduled Post', content: 'Some content', scheduledDate: '2023-10-10T12:00:00Z' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2023-10-10T12:00:00Z' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/schedule/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post scheduled successfully')).toBeInTheDocument();
}, 10000);

test('Failure: schedule a post with invalid date', async () => {
  fetchMock.post('/api/schedulePost', { status: 400, body: { error: 'Invalid date format' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: 'invalid-date' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/schedule/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid date format')).toBeInTheDocument();
}, 10000);

test('successfully tracks post likes and dislikes', async () => {
  fetchMock.post('/api/trackPostLikesDislikes', { status: 200 });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Post')); });

  expect(fetchMock.calls('/api/trackPostLikesDislikes')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackPostLikesDislikes')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Likes: 1')).toBeInTheDocument();
  await act(async () => { fireEvent.click(screen.getByText('Dislike Post')); });
  expect(screen.getByText('Dislikes: 1')).toBeInTheDocument();
}, 10000);

test('fails to track post likes and dislikes with an error message', async () => {
  fetchMock.post('/api/trackPostLikesDislikes', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Post')); });

  expect(fetchMock.calls('/api/trackPostLikesDislikes')).toHaveLength(1);
  expect(screen.getByText('Error tracking likes and dislikes')).toBeInTheDocument();
}, 10000);
