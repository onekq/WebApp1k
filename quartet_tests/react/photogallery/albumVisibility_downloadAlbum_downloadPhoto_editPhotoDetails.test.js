import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './albumVisibility_downloadAlbum_downloadPhoto_editPhotoDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Album Visibility Settings: success (from albumVisibility_downloadAlbum)', async () => {
  fetchMock.post('/api/setAlbumVisibility', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-id-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('visibility-toggle-button'));
  });

  expect(fetchMock.calls('/api/setAlbumVisibility')).toHaveLength(1);
  expect(screen.getByTestId('visibility-success')).toBeInTheDocument();
}, 10000);

test('Album Visibility Settings: failure (from albumVisibility_downloadAlbum)', async () => {
  fetchMock.post('/api/setAlbumVisibility', { throws: new Error('Visibility Change Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-id-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('visibility-toggle-button'));
  });

  expect(fetchMock.calls('/api/setAlbumVisibility')).toHaveLength(1);
  expect(screen.getByTestId('visibility-failure')).toBeInTheDocument();
}, 10000);

test('Download Album: success (from albumVisibility_downloadAlbum)', async () => {
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

test('Download Album: failure (from albumVisibility_downloadAlbum)', async () => {
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

test('downloads a photo successfully (from downloadPhoto_editPhotoDetails)', async () => {
  fetchMock.get('/download/1', { status: 200, body: 'image binary data' });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('download-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/photo downloaded/i)).toBeInTheDocument();
}, 10000);

test('fails to download a photo (from downloadPhoto_editPhotoDetails)', async () => {
  fetchMock.get('/download/1', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('download-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/download failed/i)).toBeInTheDocument();
}, 10000);

test('edits photo details successfully (from downloadPhoto_editPhotoDetails)', async () => {
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

test('fails to edit photo details (from downloadPhoto_editPhotoDetails)', async () => {
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

