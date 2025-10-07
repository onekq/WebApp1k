import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addPhotoToAlbum_batchTagPhotos_deleteComment_deletePhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Users can successfully add photos to an album. (from addPhotoToAlbum_batchTagPhotos)', async () => {
  fetchMock.post('/api/albums/photos', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('photo-input'), { target: { files: ['photo1.jpg'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Photo added')).toBeInTheDocument();
}, 10000);

test('Shows an error message when adding photo to album fails. (from addPhotoToAlbum_batchTagPhotos)', async () => {
  fetchMock.post('/api/albums/photos', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('photo-input'), { target: { files: ['photo1.jpg'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to add photo')).toBeInTheDocument();
}, 10000);

test('Users can successfully batch tag multiple photos. (from addPhotoToAlbum_batchTagPhotos)', async () => {
  fetchMock.post('/api/batch-tags', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('batch-tag-input'), { target: { value: 'Holiday' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('batch-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Batch tagged photos')).toBeInTheDocument();
}, 10000);

test('Shows an error message when batch tagging photos fails. (from addPhotoToAlbum_batchTagPhotos)', async () => {
  fetchMock.post('/api/batch-tags', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('batch-tag-input'), { target: { value: 'Holiday' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('batch-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to batch tag photos')).toBeInTheDocument();
}, 10000);

test('Should successfully delete a comment. (from deleteComment_deletePhoto)', async () => {
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

test('Should show error message when failing to delete a comment. (from deleteComment_deletePhoto)', async () => {
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

test('deletes a photo successfully (from deleteComment_deletePhoto)', async () => {
  fetchMock.delete('/photo/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-button-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/photo deleted/i)).toBeInTheDocument();
}, 10000);

test('fails to delete a photo (from deleteComment_deletePhoto)', async () => {
  fetchMock.delete('/photo/1', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-button-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/delete failed/i)).toBeInTheDocument();
}, 10000);

