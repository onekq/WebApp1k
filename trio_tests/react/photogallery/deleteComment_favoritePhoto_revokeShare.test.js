import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteComment_favoritePhoto_revokeShare';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Should successfully delete a comment.', async () => {
  fetchMock.delete('/api/photo/deleteComment', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-comment-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.queryByTestId('comment-to-delete')).not.toBeInTheDocument();
}, 10000);

test('Should show error message when failing to delete a comment.', async () => {
  fetchMock.delete('/api/photo/deleteComment', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-comment-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete comment')).toBeInTheDocument();
}, 10000);

test('Should successfully mark a photo as favorite.', async () => {
  fetchMock.post('/api/photo/favorite', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('favorite-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('favorite-icon')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to mark a photo as favorite.', async () => {
  fetchMock.post('/api/photo/favorite', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('favorite-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to favorite photo')).toBeInTheDocument();
}, 10000);

test('Revoke Share Link: success', async () => {
  fetchMock.post('/api/revokeShare', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('share-link-input'), { target: { value: 'link-id' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('revoke-share-button'));
  });

  expect(fetchMock.calls('/api/revokeShare')).toHaveLength(1);
  expect(screen.getByTestId('revoke-success')).toBeInTheDocument();
}, 10000);

test('Revoke Share Link: failure', async () => {
  fetchMock.post('/api/revokeShare', { throws: new Error('Revoke Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('share-link-input'), { target: { value: 'link-id' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('revoke-share-button'));
  });

  expect(fetchMock.calls('/api/revokeShare')).toHaveLength(1);
  expect(screen.getByTestId('revoke-failure')).toBeInTheDocument();
}, 10000);
