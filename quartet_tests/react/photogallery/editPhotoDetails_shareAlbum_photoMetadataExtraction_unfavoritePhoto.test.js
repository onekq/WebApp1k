import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editPhotoDetails_shareAlbum_photoMetadataExtraction_unfavoritePhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('edits photo details successfully (from editPhotoDetails_shareAlbum)', async () => {
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

test('fails to edit photo details (from editPhotoDetails_shareAlbum)', async () => {
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

test('Share Album: success (from editPhotoDetails_shareAlbum)', async () => {
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

test('Share Album: failure (from editPhotoDetails_shareAlbum)', async () => {
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

test('extracts photo metadata correctly (from photoMetadataExtraction_unfavoritePhoto)', async () => {
  fetchMock.post('/upload', { status: 200, body: { metadata: { date: '2021-01-01', location: 'Paris' } } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [new File(['dummy content'], 'example.png', { type: 'image/png' })] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/Date: 2021-01-01/)).toBeInTheDocument();
  expect(screen.getByText(/Location: Paris/)).toBeInTheDocument();
}, 10000);

test('fails to extract photo metadata (from photoMetadataExtraction_unfavoritePhoto)', async () => {
  fetchMock.post('/upload', { status: 200, body: {} });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [new File(['dummy content'], 'example.png', { type: 'image/png' })] } });
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('upload-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/metadata extraction failed/i)).toBeInTheDocument();
}, 10000);

test('Should successfully unmark a photo as favorite. (from photoMetadataExtraction_unfavoritePhoto)', async () => {
  fetchMock.post('/api/photo/unfavorite', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('unfavorite-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('unfavorite-icon')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to unmark a photo as favorite. (from photoMetadataExtraction_unfavoritePhoto)', async () => {
  fetchMock.post('/api/photo/unfavorite', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('unfavorite-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to unfavorite photo')).toBeInTheDocument();
}, 10000);

