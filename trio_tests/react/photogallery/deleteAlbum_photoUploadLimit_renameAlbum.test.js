import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteAlbum_photoUploadLimit_renameAlbum';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Users can successfully delete an album.', async () => {
  fetchMock.delete('/api/albums', { success: true });

  await act(async () => { render(<MemoryRouter><DeleteAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.queryByText('Album deleted')).toBeInTheDocument();
}, 10000);

test('Shows an error message when deleting album fails.', async () => {
  fetchMock.delete('/api/albums', { success: false });

  await act(async () => { render(<MemoryRouter><DeleteAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to delete album')).toBeInTheDocument();
}, 10000);

test('adheres to photo upload size limit', async () => {
  fetchMock.post('/upload', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><PhotoUploadComponent /></MemoryRouter>);
  });

  await act(async () => {
    const file = new File(['a'.repeat(2 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('upload-success-message')).toBeInTheDocument();
}, 10000);

test('fails when photo exceeds size limit', async () => {
  fetchMock.post('/upload', { status: 413 });

  await act(async () => {
    render(<MemoryRouter><PhotoUploadComponent /></MemoryRouter>);
  });

  await act(async () => {
    const file = new File(['a'.repeat(7 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/file too large/i)).toBeInTheDocument();
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
