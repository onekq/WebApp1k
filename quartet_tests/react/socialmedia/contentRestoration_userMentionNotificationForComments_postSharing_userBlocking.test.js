import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentRestoration_userMentionNotificationForComments_postSharing_userBlocking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully restores an archived post. (from contentRestoration_userMentionNotificationForComments)', async () => {
  fetchMock.post('/api/restore', {
    status: 200, body: { message: 'Post restored' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Restore'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post restored')).toBeInTheDocument();
}, 10000);

test('Shows error message when restoring an archived post fails. (from contentRestoration_userMentionNotificationForComments)', async () => {
  fetchMock.post('/api/restore', {
    status: 500, body: { message: 'Failed to restore post' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Restore'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to restore post')).toBeInTheDocument();
}, 10000);

test('should send a notification when a user is mentioned in a comment (from contentRestoration_userMentionNotificationForComments)', async () => {
  fetchMock.post('/api/comment/mention', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), {target: {value: '@jane'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a user mention in a comment (from contentRestoration_userMentionNotificationForComments)', async () => {
  fetchMock.post('/api/comment/mention', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), {target: {value: '@jane'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for sharing invalid posts. (from postSharing_userBlocking)', async () => {
  fetchMock.post('/api/posts/share', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Share'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share post.')).toBeInTheDocument();
}, 10000);

test('User blocking succeeds for valid user (from postSharing_userBlocking)', async () => {
  fetchMock.post('/api/profile/block', { body: { message: 'User blocked' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App userId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Block User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('User blocked')).toBeInTheDocument();
}, 10000);

test('User blocking fails for invalid user (from postSharing_userBlocking)', async () => {
  fetchMock.post('/api/profile/block', { body: { error: 'Invalid user' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App userId={9999} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Block User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid user')).toBeInTheDocument();
}, 10000);

