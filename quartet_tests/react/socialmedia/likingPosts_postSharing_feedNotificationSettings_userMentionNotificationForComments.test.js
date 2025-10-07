import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './likingPosts_postSharing_feedNotificationSettings_userMentionNotificationForComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should like a valid post (from likingPosts_postSharing)', async () => {
  fetchMock.post('api/like', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button-post1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when liking an invalid post (from likingPosts_postSharing)', async () => {
  fetchMock.post('api/like', { status: 404 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button-invalid')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for sharing invalid posts. (from likingPosts_postSharing)', async () => {
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

test('Successfully updates feed notification settings. (from feedNotificationSettings_userMentionNotificationForComments)', async () => {
  fetchMock.post('/api/notification-settings', {
    status: 200, body: { message: 'Settings updated' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Notify for specific users'), { target: { value: 'user1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Settings'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Settings updated')).toBeInTheDocument();
}, 10000);

test('Shows error message when updating feed notification settings fails. (from feedNotificationSettings_userMentionNotificationForComments)', async () => {
  fetchMock.post('/api/notification-settings', {
    status: 500, body: { message: 'Failed to update settings' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Notify for specific users'), { target: { value: 'user1' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Settings'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update settings')).toBeInTheDocument();
}, 10000);

test('should send a notification when a user is mentioned in a comment (from feedNotificationSettings_userMentionNotificationForComments)', async () => {
  fetchMock.post('/api/comment/mention', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), {target: {value: '@jane'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a user mention in a comment (from feedNotificationSettings_userMentionNotificationForComments)', async () => {
  fetchMock.post('/api/comment/mention', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), {target: {value: '@jane'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

