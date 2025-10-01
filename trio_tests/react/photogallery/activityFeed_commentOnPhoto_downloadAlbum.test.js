import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './activityFeed_commentOnPhoto_downloadAlbum';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Activity Feed: success', async () => {
  fetchMock.get('/api/activityFeed', { body: [{ id: 1, action: 'uploaded', item: 'Photo1' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('activity-button'));
  });

  expect(fetchMock.calls('/api/activityFeed')).toHaveLength(1);
  expect(screen.getByTestId('activity-1')).toBeInTheDocument();
}, 10000);

test('Activity Feed: failure', async () => {
  fetchMock.get('/api/activityFeed', { throws: new Error('Fetch Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('activity-button'));
  });

  expect(fetchMock.calls('/api/activityFeed')).toHaveLength(1);
  expect(screen.getByTestId('activity-failure')).toBeInTheDocument();
}, 10000);

test('Should successfully add a comment on a photo.', async () => {
  fetchMock.post('/api/photo/comment', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Nice photo!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('comment-submit'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('comment-Nice photo!')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to add a comment.', async () => {
  fetchMock.post('/api/photo/comment', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Nice photo!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('comment-submit'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add comment')).toBeInTheDocument();
}, 10000);

test('Download Album: success', async () => {
  fetchMock.post('/api/downloadAlbum', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-id-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('download-album-button'));
  });

  expect(fetchMock.calls('/api/downloadAlbum')).toHaveLength(1);
  expect(screen.getByTestId('download-success')).toBeInTheDocument();
}, 10000);

test('Download Album: failure', async () => {
  fetchMock.post('/api/downloadAlbum', { throws: new Error('Download Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-id-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('download-album-button'));
  });

  expect(fetchMock.calls('/api/downloadAlbum')).toHaveLength(1);
  expect(screen.getByTestId('download-failure')).toBeInTheDocument();
}, 10000);
