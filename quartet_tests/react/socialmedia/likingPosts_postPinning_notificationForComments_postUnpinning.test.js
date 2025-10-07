import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './likingPosts_postPinning_notificationForComments_postUnpinning';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should like a valid post (from likingPosts_postPinning)', async () => {
  fetchMock.post('api/like', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button-post1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when liking an invalid post (from likingPosts_postPinning)', async () => {
  fetchMock.post('api/like', { status: 404 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button-invalid')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Test pinning a post to the top of the profile. (from likingPosts_postPinning)', async () => {
  fetchMock.put('/api/posts/pin/1', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Pin Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post pinned successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for pinning invalid posts. (from likingPosts_postPinning)', async () => {
  fetchMock.put('/api/posts/pin/1', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Pin Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to pin post.')).toBeInTheDocument();
}, 10000);

test('should send a notification when a comment is added (from notificationForComments_postUnpinning)', async () => {
  fetchMock.post('/api/comment', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), {target: {value: 'Nice post!'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a comment (from notificationForComments_postUnpinning)', async () => {
  fetchMock.post('/api/comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), {target: {value: 'Nice post!'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Verify unpinning a post. (from notificationForComments_postUnpinning)', async () => {
  fetchMock.put('/api/posts/unpin/1', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Unpin Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post unpinned successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for unpinning non-pinned posts. (from notificationForComments_postUnpinning)', async () => {
  fetchMock.put('/api/posts/unpin/1', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Unpin Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to unpin post.')).toBeInTheDocument();
}, 10000);

