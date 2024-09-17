import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './feedAppOrdering_notificationForAppShares';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('should send a notification when a post is shared', async () => {
  fetchMock.post('/api/share', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a post share', async () => {
  fetchMock.post('/api/share', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('share-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);