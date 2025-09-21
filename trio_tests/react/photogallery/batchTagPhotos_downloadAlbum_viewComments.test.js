import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './batchTagPhotos_downloadAlbum_viewComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Users can successfully batch tag multiple photos.', async () => {
  fetchMock.post('/api/batch-tags', { success: true });

  await act(async () => { render(<MemoryRouter><BatchTagPhotosComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('batch-tag-input'), { target: { value: 'Holiday' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('batch-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Batch tagged photos')).toBeInTheDocument();
}, 10000);

test('Shows an error message when batch tagging photos fails.', async () => {
  fetchMock.post('/api/batch-tags', { success: false });

  await act(async () => { render(<MemoryRouter><BatchTagPhotosComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('batch-tag-input'), { target: { value: 'Holiday' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('batch-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to batch tag photos')).toBeInTheDocument();
}, 10000);

test('Download Album: success', async () => {
  fetchMock.post('/api/downloadAlbum', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
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
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
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
