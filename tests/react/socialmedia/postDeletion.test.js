import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SocialMediaApp from './postDeletion';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Verify successful deletion of a post.', async () => {
  fetchMock.delete('/api/posts/1', 200);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Delete'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post deleted successfully!')).toBeInTheDocument();
}, 10000);

test('Check error handling for non-existent post deletion.', async () => {
  fetchMock.delete('/api/posts/1', 404);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Delete'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post not found.')).toBeInTheDocument();
}, 10000);

