import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './feedManagement_notificationForLikes_postUnpinning';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Displays posts from followed users in feed successfully.', async () => {
  fetchMock.get('/api/feed', {
    status: 200, body: [{ id: 1, content: 'Post from followed user' }]
  });

  await act(async () => {
    render(<MemoryRouter><FeedComponent /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post from followed user')).toBeInTheDocument();
}, 10000);

test('Displays error when failing to load posts from followed users in feed.', async () => {
  fetchMock.get('/api/feed', {
    status: 500, body: { message: 'Failed to load feed' }
  });

  await act(async () => {
    render(<MemoryRouter><FeedComponent /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load feed')).toBeInTheDocument();
}, 10000);

test('should send a notification when a post is liked', async () => {
  fetchMock.post('/api/like', { success: true });

  await act(async () => { render(<MemoryRouter><Post /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a liked post', async () => {
  fetchMock.post('/api/like', 500);

  await act(async () => { render(<MemoryRouter><Post /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Verify unpinning a post.', async () => {
  fetchMock.put('/api/posts/unpin/1', 200);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Unpin Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post unpinned successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for unpinning non-pinned posts.', async () => {
  fetchMock.put('/api/posts/unpin/1', 400);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Unpin Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to unpin post.')).toBeInTheDocument();
}, 10000);
