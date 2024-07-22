import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './likeComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully likes a comment', async () => {
  fetchMock.post('/api/comments/like/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Like/i)); });

  expect(fetchMock.calls('/api/comments/like/1').length).toBe(1);
  expect(screen.getByText(/Comment liked successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to like a comment', async () => {
  fetchMock.post('/api/comments/like/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Like/i)); });

  expect(fetchMock.calls('/api/comments/like/1').length).toBe(1);
  expect(screen.getByText(/Failed to like comment/i)).toBeInTheDocument();
}, 10000);

