import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './replyToComment_trackPostViews_addComment_schedulePostForPublication';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully replies to a comment (from replyToComment_trackPostViews)', async () => {
  fetchMock.post('/api/comments/reply', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Reply to a comment/i), { target: { value: 'Thanks for your comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Reply/i)); });

  expect(fetchMock.calls('/api/comments/reply').length).toBe(1);
  expect(screen.getByText(/Reply added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to reply to a comment (from replyToComment_trackPostViews)', async () => {
  fetchMock.post('/api/comments/reply', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Reply to a comment/i), { target: { value: 'Thanks for your comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Reply/i)); });

  expect(fetchMock.calls('/api/comments/reply').length).toBe(1);
  expect(screen.getByText(/Failed to add reply/i)).toBeInTheDocument();
}, 10000);

test('successfully tracks post views (from replyToComment_trackPostViews)', async () => {
  fetchMock.post('/api/trackPostViews', { status: 200 });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Post')); });

  expect(fetchMock.calls('/api/trackPostViews')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackPostViews')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Views: 1')).toBeInTheDocument();
}, 10000);

test('fails to track post views with an error message (from replyToComment_trackPostViews)', async () => {
  fetchMock.post('/api/trackPostViews', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Post')); });

  expect(fetchMock.calls('/api/trackPostViews')).toHaveLength(1);
  expect(screen.getByText('Error tracking views')).toBeInTheDocument();
}, 10000);

test('successfully adds a comment to a post (from addComment_schedulePostForPublication)', async () => {
  fetchMock.post('/api/comments', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Add a comment/i), { target: { value: 'Great post!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Submit/i)); });

  expect(fetchMock.calls('/api/comments').length).toBe(1);
  expect(screen.getByText(/Comment added successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add a comment to a post (from addComment_schedulePostForPublication)', async () => {
  fetchMock.post('/api/comments', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText(/Add a comment/i), { target: { value: 'Great post!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Submit/i)); });

  expect(fetchMock.calls('/api/comments').length).toBe(1);
  expect(screen.getByText(/Failed to add comment/i)).toBeInTheDocument();
}, 10000);

test('Success: schedule a post for future publication (from addComment_schedulePostForPublication)', async () => {
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

test('Failure: schedule a post with invalid date (from addComment_schedulePostForPublication)', async () => {
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

