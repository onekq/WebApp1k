import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './feedManagement_postDraftDeletion_notificationForProfileUpdates_profileViewing';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays posts from followed users in feed successfully. (from feedManagement_postDraftDeletion)', async () => {
  fetchMock.get('/api/feed', {
    status: 200, body: [{ id: 1, content: 'Post from followed user' }]
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post from followed user')).toBeInTheDocument();
}, 10000);

test('Displays error when failing to load posts from followed users in feed. (from feedManagement_postDraftDeletion)', async () => {
  fetchMock.get('/api/feed', {
    status: 500, body: { message: 'Failed to load feed' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load feed')).toBeInTheDocument();
}, 10000);

test('Verify deletion of saved drafts. (from feedManagement_postDraftDeletion)', async () => {
  fetchMock.delete('/api/posts/draft/1', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Delete Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft deleted successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for non-existent draft deletion. (from feedManagement_postDraftDeletion)', async () => {
  fetchMock.delete('/api/posts/draft/1', 404);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Delete Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft not found.')).toBeInTheDocument();
}, 10000);

test('should send a notification when a profile is updated (from notificationForProfileUpdates_profileViewing)', async () => {
  fetchMock.post('/api/profile/update', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-input'), {target: {value: 'new info'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-profile-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a profile update (from notificationForProfileUpdates_profileViewing)', async () => {
  fetchMock.post('/api/profile/update', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-input'), {target: {value: 'new info'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-profile-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Profile viewing succeeds for existing profile (from notificationForProfileUpdates_profileViewing)', async () => {
  fetchMock.get('/api/profile/1', { body: { name: 'John Doe' }, status: 200 });

  await act(async () => { render(<MemoryRouter><AppView profileId={1} /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
}, 10000);

test('Profile viewing fails for non-existent profile (from notificationForProfileUpdates_profileViewing)', async () => {
  fetchMock.get('/api/profile/999', { body: { error: 'Profile not found' }, status: 404 });

  await act(async () => { render(<MemoryRouter><AppView profileId={999} /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile not found')).toBeInTheDocument();
}, 10000);

