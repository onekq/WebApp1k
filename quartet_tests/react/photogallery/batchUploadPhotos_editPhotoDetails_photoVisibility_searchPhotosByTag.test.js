import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './batchUploadPhotos_editPhotoDetails_photoVisibility_searchPhotosByTag';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('batch uploads multiple photos successfully (from batchUploadPhotos_editPhotoDetails)', async () => {
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

test('fails to batch upload multiple photos (from batchUploadPhotos_editPhotoDetails)', async () => {
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

test('edits photo details successfully (from batchUploadPhotos_editPhotoDetails)', async () => {
  fetchMock.put('/photo/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'New Title' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('save-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/details updated/i)).toBeInTheDocument();
}, 10000);

test('fails to edit photo details (from batchUploadPhotos_editPhotoDetails)', async () => {
  fetchMock.put('/photo/1', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'New Title' } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('save-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/update failed/i)).toBeInTheDocument();
}, 10000);

test('Photo Visibility Settings: success (from photoVisibility_searchPhotosByTag)', async () => {
  fetchMock.post('/api/setPhotoVisibility', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('photo-id-input'), { target: { value: 'PhotoID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('visibility-toggle-button'));
  });

  expect(fetchMock.calls('/api/setPhotoVisibility')).toHaveLength(1);
  expect(screen.getByTestId('visibility-success')).toBeInTheDocument();
}, 10000);

test('Photo Visibility Settings: failure (from photoVisibility_searchPhotosByTag)', async () => {
  fetchMock.post('/api/setPhotoVisibility', { throws: new Error('Visibility Change Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('photo-id-input'), { target: { value: 'PhotoID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('visibility-toggle-button'));
  });

  expect(fetchMock.calls('/api/setPhotoVisibility')).toHaveLength(1);
  expect(screen.getByTestId('visibility-failure')).toBeInTheDocument();
}, 10000);

test('should successfully search photos by tag (from photoVisibility_searchPhotosByTag)', async () => {
  fetchMock.get('/api/search?tag=sunset', { photos: [{ id: 1, tag: 'sunset' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'sunset' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('should fail to search photos by tag with error message (from photoVisibility_searchPhotosByTag)', async () => {
  fetchMock.get('/api/search?tag=sunset', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'sunset' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No photos found')).toBeInTheDocument();
}, 10000);

