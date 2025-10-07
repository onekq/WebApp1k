import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './feedPostOrdering_notificationForPostShares_postEditing_privacySettingsUpdate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully orders posts in feed. (from feedPostOrdering_notificationForPostShares)', async () => {
  fetchMock.get('/api/feed?order=popular', {
    status: 200, body: [{ id: 1, content: 'Most popular post' }]
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Order By'), { target: { value: 'popular' } });
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Most popular post')).toBeInTheDocument();
}, 10000);

test('Shows error message when ordering posts fails. (from feedPostOrdering_notificationForPostShares)', async () => {
  fetchMock.get('/api/feed?order=popular', {
    status: 500, body: { message: 'Failed to order posts' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText('Order By'), { target: { value: 'popular' } });
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to order posts')).toBeInTheDocument();
}, 10000);

test('should send a notification when a post is shared (from feedPostOrdering_notificationForPostShares)', async () => {
  fetchMock.post('/api/share', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a post share (from feedPostOrdering_notificationForPostShares)', async () => {
  fetchMock.post('/api/share', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Test updating an existing post. (from postEditing_privacySettingsUpdate)', async () => {
  fetchMock.put('/api/posts/1', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit'), { target: { value: 'New content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post updated successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure changes are saved and displayed. (from postEditing_privacySettingsUpdate)', async () => {
  fetchMock.put('/api/posts/1', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update the post.')).toBeInTheDocument();
}, 10000);

test('Privacy settings update succeeds (from postEditing_privacySettingsUpdate)', async () => {
  fetchMock.put('/api/profile/privacy-settings', { body: { message: 'Privacy settings updated' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('privacy-setting'), { target: { value: 'private' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Settings')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Privacy settings updated')).toBeInTheDocument();
}, 10000);

test('Privacy settings update fails (from postEditing_privacySettingsUpdate)', async () => {
  fetchMock.put('/api/profile/privacy-settings', { body: { error: 'Failed to update settings' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('privacy-setting'), { target: { value: 'invalid' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Settings')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update settings')).toBeInTheDocument();
}, 10000);

