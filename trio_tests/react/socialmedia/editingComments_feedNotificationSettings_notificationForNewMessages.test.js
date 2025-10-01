import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editingComments_feedNotificationSettings_notificationForNewMessages';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Should update an existing comment', async () => {
  fetchMock.put('api/comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('edit-comment-input'), { target: { value: 'Updated comment' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when updating a comment with invalid data', async () => {
  fetchMock.put('api/comment', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('edit-comment-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

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

test('should send a notification when a user receives a new message', async () => {
  fetchMock.post('/api/message', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('message-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a new message', async () => {
  fetchMock.post('/api/message', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('message-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
