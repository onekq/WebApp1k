import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './notificationForPostPins_postCreation_contentSearch_postDraftSaving';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should send a notification when a post is pinned (from notificationForPostPins_postCreation)', async () => {
  fetchMock.post('/api/pin', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a post pin (from notificationForPostPins_postCreation)', async () => {
  fetchMock.post('/api/pin', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('pin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Verify post creation with valid content. (from notificationForPostPins_postCreation)', async () => {
  fetchMock.post('/api/posts', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Write a post...'), { target: { value: 'Hello World!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post created successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for invalid post content. (from notificationForPostPins_postCreation)', async () => {
  fetchMock.post('/api/posts', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Write a post...'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post content cannot be empty.')).toBeInTheDocument();
}, 10000);

test('Successfully searches and displays posts. (from contentSearch_postDraftSaving)', async () => {
  fetchMock.post('/api/search', {
    status: 200, body: [{ id: 1, content: 'Search result' }]
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'test' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Search result')).toBeInTheDocument();
}, 10000);

test('Shows error message for invalid search query. (from contentSearch_postDraftSaving)', async () => {
  fetchMock.post('/api/search', {
    status: 400, body: { message: 'Invalid search query' }
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid search query')).toBeInTheDocument();
}, 10000);

test('Verify saving posts as drafts. (from contentSearch_postDraftSaving)', async () => {
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

test('Ensure error handling for saving drafts. (from contentSearch_postDraftSaving)', async () => {
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

