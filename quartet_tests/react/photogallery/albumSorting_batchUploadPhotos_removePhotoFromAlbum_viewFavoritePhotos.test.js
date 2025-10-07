import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './albumSorting_batchUploadPhotos_removePhotoFromAlbum_viewFavoritePhotos';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Album Sorting: success (from albumSorting_batchUploadPhotos)', async () => {
  fetchMock.get('/api/albums?sortBy=date', { body: [{ id: 1, name: 'Album1' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'date' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-button'));
  });

  expect(fetchMock.calls('/api/albums?sortBy=date')).toHaveLength(1);
  expect(screen.getByTestId('album-1')).toBeInTheDocument();
}, 10000);

test('Album Sorting: failure (from albumSorting_batchUploadPhotos)', async () => {
  fetchMock.get('/api/albums?sortBy=date', { throws: new Error('Sort Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'date' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-button'));
  });

  expect(fetchMock.calls('/api/albums?sortBy=date')).toHaveLength(1);
  expect(screen.getByTestId('sort-failure')).toBeInTheDocument();
}, 10000);

test('batch uploads multiple photos successfully (from albumSorting_batchUploadPhotos)', async () => {
  fetchMock.post('/upload/batch', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    const files = [
      new File(['dummy content'], 'example1.png', { type: 'image/png' }),
      new File(['dummy content'], 'example2.png', { type: 'image/png' })
    ];
    fireEvent.change(screen.getByTestId('file-input'), { target: { files } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('upload-success-message')).toBeInTheDocument();
}, 10000);

test('fails to batch upload multiple photos (from albumSorting_batchUploadPhotos)', async () => {
  fetchMock.post('/upload/batch', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    const files = [
      new File(['dummy content'], 'example1.png', { type: 'image/png' }),
      new File(['dummy content'], 'example2.png', { type: 'image/png' })
    ];
    fireEvent.change(screen.getByTestId('file-input'), { target: { files } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/batch upload failed/i)).toBeInTheDocument();
}, 10000);

test('Users can successfully remove photos from an album. (from removePhotoFromAlbum_viewFavoritePhotos)', async () => {
  fetchMock.delete('/api/albums/photos', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.queryByText('Photo removed')).toBeInTheDocument();
}, 10000);

test('Shows an error message when removing photo from album fails. (from removePhotoFromAlbum_viewFavoritePhotos)', async () => {
  fetchMock.delete('/api/albums/photos', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to remove photo')).toBeInTheDocument();
}, 10000);

test('Should successfully view all favorite photos. (from removePhotoFromAlbum_viewFavoritePhotos)', async () => {
  fetchMock.get('/api/photo/favorites', { status: 200, body: { photos: ['Photo 1', 'Photo 2'] } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-favorites-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Photo 1')).toBeInTheDocument();
  expect(screen.getByText('Photo 2')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to view all favorite photos. (from removePhotoFromAlbum_viewFavoritePhotos)', async () => {
  fetchMock.get('/api/photo/favorites', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-favorites-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load favorite photos')).toBeInTheDocument();
}, 10000);

