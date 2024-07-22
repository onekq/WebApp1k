import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SocialMediaApp from './postUnpinning';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Verify unpinning a post.', async () => {
  fetchMock.put('/api/posts/unpin/1', 200);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Unpin Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post unpinned successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for unpinning non-pinned posts.', async () => {
  fetchMock.put('/api/posts/unpin/1', 400);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Unpin Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to unpin post.')).toBeInTheDocument();
}, 10000);