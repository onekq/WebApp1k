import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './viewComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully view comments on a photo.', async () => {
  fetchMock.get('/api/photo/comments', { status: 200, body: { comments: ['Comment 1', 'Comment 2'] } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-comments-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment 1')).toBeInTheDocument();
  expect(screen.getByText('Comment 2')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to view comments on a photo.', async () => {
  fetchMock.get('/api/photo/comments', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-comments-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load comments')).toBeInTheDocument();
}, 10000);

