import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import TrackPostLikesDislikes from './trackPostLikesAndDislikes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully tracks post likes and dislikes', async () => {
  fetchMock.post('/api/trackPostLikesDislikes', { status: 200 });

  await act(async () => { render(<MemoryRouter><TrackPostLikesDislikes postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Post')); });

  expect(fetchMock.calls('/api/trackPostLikesDislikes')).toHaveLength(1);
  expect(fetchMock.calls('/api/trackPostLikesDislikes')[0][1].body).toContain('"postId":"1"');
  expect(screen.getByText('Likes: 1')).toBeInTheDocument();
  await act(async () => { fireEvent.click(screen.getByText('Dislike Post')); });
  expect(screen.getByText('Dislikes: 1')).toBeInTheDocument();
}, 10000);

test('fails to track post likes and dislikes with an error message', async () => {
  fetchMock.post('/api/trackPostLikesDislikes', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><TrackPostLikesDislikes postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Like Post')); });

  expect(fetchMock.calls('/api/trackPostLikesDislikes')).toHaveLength(1);
  expect(screen.getByText('Error tracking likes and dislikes')).toBeInTheDocument();
}, 10000);

