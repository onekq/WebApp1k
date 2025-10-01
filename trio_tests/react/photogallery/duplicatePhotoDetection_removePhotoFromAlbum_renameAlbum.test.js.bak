import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './duplicatePhotoDetection_removePhotoFromAlbum_renameAlbum';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('detects a duplicate photo', async () => {
  fetchMock.post('/upload', { status: 409 });

  await act(async () => {
    render(<MemoryRouter><PhotoUploadComponent /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [new File(['dummy content'], 'example.png', { type: 'image/png' })] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/duplicate photo detected/i)).toBeInTheDocument();
}, 10000);

test('does not detect a duplicate photo', async () => {
  fetchMock.post('/upload', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><PhotoUploadComponent /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [new File(['dummy content'], 'example.png', { type: 'image/png' })] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('upload-success-message')).toBeInTheDocument();
}, 10000);

test('Users can successfully remove photos from an album.', async () => {
  fetchMock.delete('/api/albums/photos', { success: true });

  await act(async () => { render(<MemoryRouter><RemovePhotoFromAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.queryByText('Photo removed')).toBeInTheDocument();
}, 10000);

test('Shows an error message when removing photo from album fails.', async () => {
  fetchMock.delete('/api/albums/photos', { success: false });

  await act(async () => { render(<MemoryRouter><RemovePhotoFromAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to remove photo')).toBeInTheDocument();
}, 10000);

test('Users can successfully rename an album.', async () => {
  fetchMock.put('/api/albums', { success: true });

  await act(async () => { render(<MemoryRouter><RenameAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('album-name-input'), { target: { value: 'NewAlbumName' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rename-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('NewAlbumName')).toBeInTheDocument();
}, 10000);

test('Shows an error message when renaming album fails.', async () => {
  fetchMock.put('/api/albums', { success: false });

  await act(async () => { render(<MemoryRouter><RenameAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('album-name-input'), { target: { value: 'NewAlbumName' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rename-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to rename album')).toBeInTheDocument();
}, 10000);
