import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './feedManagement_postDraftDeletion';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays posts from followed users in feed successfully.', async () => {
  fetchMock.get('/api/feed', {
    status: 200, body: [{ id: 1, content: 'Post from followed user' }]
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post from followed user')).toBeInTheDocument();
}, 10000);

test('Displays error when failing to load posts from followed users in feed.', async () => {
  fetchMock.get('/api/feed', {
    status: 500, body: { message: 'Failed to load feed' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load feed')).toBeInTheDocument();
}, 10000);

test('Verify deletion of saved drafts.', async () => {
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

test('Ensure error handling for non-existent draft deletion.', async () => {
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