import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrieveCommentCount';

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