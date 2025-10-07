import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentRestoration_userMentionNotificationForComments_editingComments_userMentionNotification';

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

test('Should update an existing comment (from editingComments_userMentionNotification)', async () => {
  fetchMock.put('api/comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('edit-comment-input'), { target: { value: 'Updated comment' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when updating a comment with invalid data (from editingComments_userMentionNotification)', async () => {
  fetchMock.put('api/comment', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('edit-comment-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('should send a notification when a user is mentioned in a post (from editingComments_userMentionNotification)', async () => {
  fetchMock.post('/api/mention', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('post-input'), {target: {value: '@john'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a user mention in a post (from editingComments_userMentionNotification)', async () => {
  fetchMock.post('/api/mention', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('post-input'), {target: {value: '@john'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

