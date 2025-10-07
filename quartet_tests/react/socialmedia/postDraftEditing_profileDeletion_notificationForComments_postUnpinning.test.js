import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './postDraftEditing_profileDeletion_notificationForComments_postUnpinning';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Test editing saved drafts. (from postDraftEditing_profileDeletion)', async () => {
  fetchMock.put('/api/posts/draft/1', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit Draft'), { target: { value: 'Updated draft content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft updated successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure changes are saved and displayed (draft). (from postDraftEditing_profileDeletion)', async () => {
  fetchMock.put('/api/posts/draft/1', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit Draft'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update draft.')).toBeInTheDocument();
}, 10000);

test('Profile deletion succeeds for valid profile (from postDraftEditing_profileDeletion)', async () => {
  fetchMock.delete('/api/profile/1', { body: { message: 'Profile deleted' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App profileId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile deleted')).toBeInTheDocument();
}, 10000);

test('Profile deletion fails for non-existent profile (from postDraftEditing_profileDeletion)', async () => {
  fetchMock.delete('/api/profile/9999', { body: { error: 'Profile not found' }, status: 404 });

  await act(async () => { render(<MemoryRouter><App profileId={9999} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile not found')).toBeInTheDocument();
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

