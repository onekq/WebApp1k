import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editComment_likePhoto_shareAlbum';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Should successfully edit a comment.', async () => {
  fetchMock.put('/api/photo/editComment', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('edit-comment-input'), { target: { value: 'Edited comment!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-comment-submit'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('comment-Edited comment!')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to edit a comment.', async () => {
  fetchMock.put('/api/photo/editComment', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('edit-comment-input'), { target: { value: 'Edited comment!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-comment-submit'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to edit comment')).toBeInTheDocument();
}, 10000);

test('Should successfully like a photo.', async () => {
  fetchMock.post('/api/photo/like', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('like-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('like-icon')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to like a photo.', async () => {
  fetchMock.post('/api/photo/like', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('like-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to like photo')).toBeInTheDocument();
}, 10000);

test('Share Album: success', async () => {
  fetchMock.post('/api/shareAlbum', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-album-button'));
  });

  expect(fetchMock.calls('/api/shareAlbum')).toHaveLength(1);
  expect(screen.getByTestId('share-album-success')).toBeInTheDocument();
}, 10000);

test('Share Album: failure', async () => {
  fetchMock.post('/api/shareAlbum', { throws: new Error('Share Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-album-button'));
  });

  expect(fetchMock.calls('/api/shareAlbum')).toHaveLength(1);
  expect(screen.getByTestId('share-album-failure')).toBeInTheDocument();
}, 10000);
