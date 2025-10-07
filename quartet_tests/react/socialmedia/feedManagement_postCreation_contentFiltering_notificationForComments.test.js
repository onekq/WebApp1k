import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './feedManagement_postCreation_contentFiltering_notificationForComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays posts from followed users in feed successfully. (from feedManagement_postCreation)', async () => {
  fetchMock.get('/api/feed', {
    status: 200, body: [{ id: 1, content: 'Post from followed user' }]
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post from followed user')).toBeInTheDocument();
}, 10000);

test('Displays error when failing to load posts from followed users in feed. (from feedManagement_postCreation)', async () => {
  fetchMock.get('/api/feed', {
    status: 500, body: { message: 'Failed to load feed' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load feed')).toBeInTheDocument();
}, 10000);

test('Verify post creation with valid content. (from feedManagement_postCreation)', async () => {
  fetchMock.post('/api/posts', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Write a post...'), { target: { value: 'Hello World!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post created successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for invalid post content. (from feedManagement_postCreation)', async () => {
  fetchMock.post('/api/posts', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Write a post...'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post content cannot be empty.')).toBeInTheDocument();
}, 10000);

test('Filters posts by hashtags successfully. (from contentFiltering_notificationForComments)', async () => {
  fetchMock.post('/api/filter', {
    status: 200, body: [{ id: 1, content: 'Hashtag post' }]
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('#Hashtag'), { target: { value: 'test' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Hashtag post')).toBeInTheDocument();
}, 10000);

test('Shows error message for invalid hashtag filter. (from contentFiltering_notificationForComments)', async () => {
  fetchMock.post('/api/filter', {
    status: 400, body: { message: 'Invalid hashtag' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('#Hashtag'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid hashtag')).toBeInTheDocument();
}, 10000);

test('should send a notification when a comment is added (from contentFiltering_notificationForComments)', async () => {
  fetchMock.post('/api/comment', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), {target: {value: 'Nice post!'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a comment (from contentFiltering_notificationForComments)', async () => {
  fetchMock.post('/api/comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), {target: {value: 'Nice post!'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

