import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './batchUploadPhotos_downloadAlbum_viewPhotoDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('views detailed information of a photo successfully', async () => {
  fetchMock.get('/photo/1', { status: 200, body: { title: 'Sunset', date: '2021-01-01', location: 'Beach' } });

  await act(async () => {
    render(<MemoryRouter><PhotoDetailsComponent id="1" /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Sunset/)).toBeInTheDocument();
  expect(screen.getByText(/2021-01-01/)).toBeInTheDocument();
  expect(screen.getByText(/Beach/)).toBeInTheDocument();
}, 10000);

test('fails to view detailed information of a photo', async () => {
  fetchMock.get('/photo/1', { status: 404 });

  await act(async () => {
    render(<MemoryRouter><PhotoDetailsComponent id="1" /></MemoryRouter>);
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/details not found/i)).toBeInTheDocument();
}, 10000);
