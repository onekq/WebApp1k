import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentSearch_feedPostOrdering_userMentionNotification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully searches and displays posts.', async () => {
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

test('Shows error message for invalid search query.', async () => {
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

test('Successfully orders posts in feed.', async () => {
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

test('Shows error message when ordering posts fails.', async () => {
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

test('should send a notification when a user is mentioned in a post', async () => {
  fetchMock.post('/api/mention', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('post-input'), {target: {value: '@john'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a user mention in a post', async () => {
  fetchMock.post('/api/mention', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('post-input'), {target: {value: '@john'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('post-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
