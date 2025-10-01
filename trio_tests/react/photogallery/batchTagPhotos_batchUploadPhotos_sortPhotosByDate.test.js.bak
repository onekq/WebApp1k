import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './batchTagPhotos_batchUploadPhotos_sortPhotosByDate';

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

test('batch uploads multiple photos successfully', async () => {
  fetchMock.post('/upload/batch', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><BatchPhotoUploadComponent /></MemoryRouter>);
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

test('fails to batch upload multiple photos', async () => {
  fetchMock.post('/upload/batch', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><BatchPhotoUploadComponent /></MemoryRouter>);
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

test('Users can successfully sort photos by date.', async () => {
  fetchMock.get('/api/sort-photos-by-date', { success: true, data: ['photo1', 'photo2'] });

  await act(async () => { render(<MemoryRouter><SortPhotosByDateComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-date-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Photos sorted by date')).toBeInTheDocument();
}, 10000);

test('Shows an error message when sorting photos by date fails.', async () => {
  fetchMock.get('/api/sort-photos-by-date', { success: false });

  await act(async () => { render(<MemoryRouter><SortPhotosByDateComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-date-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to sort photos by date')).toBeInTheDocument();
}, 10000);
