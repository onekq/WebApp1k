import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import Community from './commentOnUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully comments on a community update', async () => {
  fetchMock.post('/api/community/comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Nice update!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment added successfully')).toBeInTheDocument();
}, 10000);

test('Fails to comment on a community update', async () => {
  fetchMock.post('/api/community/comment', { status: 400 });

  await act(async () => { render(<MemoryRouter><Community /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add comment')).toBeInTheDocument();
}, 10000);

