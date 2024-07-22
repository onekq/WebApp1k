import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SocialMediaApp from './postVisibility';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Test visibility settings for public posts.', async () => {
  fetchMock.patch('/api/posts/1', 200);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Set Public'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post is now public.')).toBeInTheDocument();
}, 10000);

test('Test visibility settings for private posts.', async () => {
  fetchMock.patch('/api/posts/1', 400);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Set Private'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update visibility settings.')).toBeInTheDocument();
}, 10000);

