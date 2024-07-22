import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import FeedComponent from './feedRefresh';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully refreshes feed to show new posts.', async () => {
  fetchMock.get('/api/feed', {
    status: 200, body: [{ id: 1, content: 'New post' }]
  });

  await act(async () => {
    render(<MemoryRouter><FeedComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Refresh'));
  });

  expect(fetchMock.calls()).toHaveLength(2);
  expect(screen.getByText('New post')).toBeInTheDocument();
}, 10000);

test('Shows error message when feed refresh fails.', async () => {
  fetchMock.get('/api/feed', {
    status: 500, body: { message: 'Failed to refresh feed' }
  });

  await act(async () => {
    render(<MemoryRouter><FeedComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Refresh'));
  });

  expect(fetchMock.calls()).toHaveLength(2);
  expect(screen.getByText('Failed to refresh feed')).toBeInTheDocument();
}, 10000);

