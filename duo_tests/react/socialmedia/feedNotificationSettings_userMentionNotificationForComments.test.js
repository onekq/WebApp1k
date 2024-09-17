import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './feedNotificationSettings_userMentionNotificationForComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully updates feed notification settings.', async () => {
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

test('Shows error message when updating feed notification settings fails.', async () => {
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

test('should send a notification when a user is mentioned in a comment', async () => {
  fetchMock.post('/api/comment/mention', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), {target: {value: '@jane'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a user mention in a comment', async () => {
  fetchMock.post('/api/comment/mention', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), {target: {value: '@jane'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);