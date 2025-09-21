import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './commentReplies_feedRefresh_notificationSettingsUpdate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Should reply to an existing comment', async () => {
  fetchMock.post('api/reply', { status: 200 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('reply-input'), { target: { value: 'Nice comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Reply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when replying to an invalid comment', async () => {
  fetchMock.post('api/reply', { status: 404 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('reply-input'), { target: { value: 'Nice comment!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Reply')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully refreshes feed to show new posts.', async () => {
  fetchMock.get('/api/feed', {
    status: 200, body: [{ id: 1, content: 'New post' }]
  });

  await act(async () => {
    render(<MemoryRouter><FeedComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Refresh'));
  });

  expect(fetchMock.calls()).toHaveLength(2);
  expect(screen.getByText('New post')).toBeInTheDocument();
}, 10000);

test('Shows error message when feed refresh fails.', async () => {
  fetchMock.get('/api/feed', {
    status: 500, body: { message: 'Failed to refresh feed' }
  });

  await act(async () => {
    render(<MemoryRouter><FeedComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Refresh'));
  });

  expect(fetchMock.calls()).toHaveLength(2);
  expect(screen.getByText('Failed to refresh feed')).toBeInTheDocument();
}, 10000);

test('should update notification settings', async () => {
  fetchMock.post('/api/notification/settings', { success: true });

  await act(async () => { render(<MemoryRouter><Settings /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('settings-input'), {target: {value: 'new-settings'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-settings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('should handle error when updating notification settings fails', async () => {
  fetchMock.post('/api/notification/settings', 500);

  await act(async () => { render(<MemoryRouter><Settings /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('settings-input'), {target: {value: 'new-settings'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-settings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
