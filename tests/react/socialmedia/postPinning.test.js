import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SocialMediaApp from './postPinning';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Test pinning a post to the top of the profile.', async () => {
  fetchMock.put('/api/posts/pin/1', 200);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Pin Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post pinned successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for pinning invalid posts.', async () => {
  fetchMock.put('/api/posts/pin/1', 400);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Pin Post'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to pin post.')).toBeInTheDocument();
}, 10000);

