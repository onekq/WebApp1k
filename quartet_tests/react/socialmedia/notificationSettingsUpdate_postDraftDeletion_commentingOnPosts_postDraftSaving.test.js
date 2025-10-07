import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './notificationSettingsUpdate_postDraftDeletion_commentingOnPosts_postDraftSaving';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should update notification settings (from notificationSettingsUpdate_postDraftDeletion)', async () => {
  fetchMock.post('/api/notification/settings', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('settings-input'), {target: {value: 'new-settings'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-settings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('should handle error when updating notification settings fails (from notificationSettingsUpdate_postDraftDeletion)', async () => {
  fetchMock.post('/api/notification/settings', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('settings-input'), {target: {value: 'new-settings'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-settings-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Verify deletion of saved drafts. (from notificationSettingsUpdate_postDraftDeletion)', async () => {
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

test('Ensure error handling for non-existent draft deletion. (from notificationSettingsUpdate_postDraftDeletion)', async () => {
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

test('Should add a comment to a post (from commentingOnPosts_postDraftSaving)', async () => {
  fetchMock.post('api/comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Great post!' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Comment')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when adding an invalid comment to a post (from commentingOnPosts_postDraftSaving)', async () => {
  fetchMock.post('api/comment', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Comment')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Verify saving posts as drafts. (from commentingOnPosts_postDraftSaving)', async () => {
  fetchMock.post('/api/posts/draft', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Write a post...'), { target: { value: 'Save as draft content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save as Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft saved successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for saving drafts. (from commentingOnPosts_postDraftSaving)', async () => {
  fetchMock.post('/api/posts/draft', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Write a post...'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save as Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save draft.')).toBeInTheDocument();
}, 10000);

