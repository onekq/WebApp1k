import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './postSharing_userBlocking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Verify sharing posts to user\'s feed.', async () => {
  fetchMock.post('/api/posts/share', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Share'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post shared successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for sharing invalid posts.', async () => {
  fetchMock.post('/api/posts/share', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Share'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share post.')).toBeInTheDocument();
}, 10000);

test('User blocking succeeds for valid user', async () => {
  fetchMock.post('/api/profile/block', { body: { message: 'User blocked' }, status: 200 });

  await act(async () => { render(<MemoryRouter><App userId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Block User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('User blocked')).toBeInTheDocument();
}, 10000);

test('User blocking fails for invalid user', async () => {
  fetchMock.post('/api/profile/block', { body: { error: 'Invalid user' }, status: 400 });

  await act(async () => { render(<MemoryRouter><App userId={9999} /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Block User')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid user')).toBeInTheDocument();
}, 10000);