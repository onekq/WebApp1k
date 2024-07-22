import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './retrieveComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully retrieves comments for a post', async () => {
  fetchMock.get('/api/comments?postId=1', [{ id: 1, content: 'Great post!' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/comments?postId=1').length).toBe(1);
  expect(screen.getByText(/Great post!/i)).toBeInTheDocument();
}, 10000);

test('fails to retrieve comments for a post', async () => {
  fetchMock.get('/api/comments?postId=1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/comments?postId=1').length).toBe(1);
  expect(screen.getByText(/Failed to retrieve comments/i)).toBeInTheDocument();
}, 10000);


