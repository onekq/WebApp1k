import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './dislikeComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully dislikes a comment', async () => {
  fetchMock.post('/api/comments/dislike/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Dislike/i)); });

  expect(fetchMock.calls('/api/comments/dislike/1').length).toBe(1);
  expect(screen.getByText(/Comment disliked successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to dislike a comment', async () => {
  fetchMock.post('/api/comments/dislike/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Dislike/i)); });

  expect(fetchMock.calls('/api/comments/dislike/1').length).toBe(1);
  expect(screen.getByText(/Failed to dislike comment/i)).toBeInTheDocument();
}, 10000);

