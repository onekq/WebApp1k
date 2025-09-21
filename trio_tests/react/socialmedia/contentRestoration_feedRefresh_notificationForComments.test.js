import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentRestoration_feedRefresh_notificationForComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully restores an archived post.', async () => {
  fetchMock.post('/api/restore', {
    status: 200, body: { message: 'Post restored' }
  });

  await act(async () => {
    render(<MemoryRouter><ArchivedComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Restore'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post restored')).toBeInTheDocument();
}, 10000);

test('Shows error message when restoring an archived post fails.', async () => {
  fetchMock.post('/api/restore', {
    status: 500, body: { message: 'Failed to restore post' }
  });

  await act(async () => {
    render(<MemoryRouter><ArchivedComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Restore'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to restore post')).toBeInTheDocument();
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

test('should send a notification when a comment is added', async () => {
  fetchMock.post('/api/comment', { success: true });

  await act(async () => { render(<MemoryRouter><Post /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), {target: {value: 'Nice post!'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a comment', async () => {
  fetchMock.post('/api/comment', 500);

  await act(async () => { render(<MemoryRouter><Post /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), {target: {value: 'Nice post!'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
