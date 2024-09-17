import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrieveCommentCount_trackPostViews';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully retrieves comment count for a post', async () => {
  fetchMock.get('/api/comments/count?postId=1', { count: 10 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/comments/count?postId=1').length).toBe(1);
  expect(screen.getByText(/10 comments/i)).toBeInTheDocument();
}, 10000);

test('fails to retrieve comment count for a post', async () => {
  fetchMock.get('/api/comments/count?postId=1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/comments/count?postId=1').length).toBe(1);
  expect(screen.getByText(/Failed to retrieve comment count/i)).toBeInTheDocument();
}, 10000);

test('successfully tracks post views', async () => {
  fetchMock.post('/api/trackPostViews', { status: 200 });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Post')); });

  expect(fetchMock.calls('/api/trackPostViews')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackPostViews')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Views: 1')).toBeInTheDocument();
}, 10000);

test('fails to track post views with an error message', async () => {
  fetchMock.post('/api/trackPostViews', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Post')); });

  expect(fetchMock.calls('/api/trackPostViews')).toHaveLength(1);
  expect(screen.getByText('Error tracking views')).toBeInTheDocument();
}, 10000);