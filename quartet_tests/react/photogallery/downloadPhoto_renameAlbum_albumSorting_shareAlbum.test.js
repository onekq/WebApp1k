import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './downloadPhoto_renameAlbum_albumSorting_shareAlbum';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('downloads a photo successfully (from downloadPhoto_renameAlbum)', async () => {
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

test('fails to download a photo (from downloadPhoto_renameAlbum)', async () => {
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

test('Users can successfully rename an album. (from downloadPhoto_renameAlbum)', async () => {
  fetchMock.put('/api/albums', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('album-name-input'), { target: { value: 'NewAlbumName' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rename-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('NewAlbumName')).toBeInTheDocument();
}, 10000);

test('Shows an error message when renaming album fails. (from downloadPhoto_renameAlbum)', async () => {
  fetchMock.put('/api/albums', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('album-name-input'), { target: { value: 'NewAlbumName' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rename-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to rename album')).toBeInTheDocument();
}, 10000);

test('Album Sorting: success (from albumSorting_shareAlbum)', async () => {
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

test('Album Sorting: failure (from albumSorting_shareAlbum)', async () => {
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

test('Share Album: success (from albumSorting_shareAlbum)', async () => {
  fetchMock.post('/api/shareAlbum', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-album-button'));
  });

  expect(fetchMock.calls('/api/shareAlbum')).toHaveLength(1);
  expect(screen.getByTestId('share-album-success')).toBeInTheDocument();
}, 10000);

test('Share Album: failure (from albumSorting_shareAlbum)', async () => {
  fetchMock.post('/api/shareAlbum', { throws: new Error('Share Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-album-button'));
  });

  expect(fetchMock.calls('/api/shareAlbum')).toHaveLength(1);
  expect(screen.getByTestId('share-album-failure')).toBeInTheDocument();
}, 10000);

