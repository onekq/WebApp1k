import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './duplicatePhotoDetection_unfavoritePhoto_viewAlbumPhotos';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('detects a duplicate photo', async () => {
  fetchMock.post('/upload', { status: 409 });

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
  expect(screen.getByText(/duplicate photo detected/i)).toBeInTheDocument();
}, 10000);

test('does not detect a duplicate photo', async () => {
  fetchMock.post('/upload', { status: 200 });

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
  expect(screen.getByTestId('upload-success-message')).toBeInTheDocument();
}, 10000);

test('Should successfully unmark a photo as favorite.', async () => {
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

test('Should show error message when failing to unmark a photo as favorite.', async () => {
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

test('View Album Photos: success', async () => {
  fetchMock.get('/api/album/photos?album=AlbumID', { body: [{ id: 1, name: 'Photo1' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-id-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-photos-button'));
  });

  expect(fetchMock.calls('/api/album/photos?album=AlbumID')).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('View Album Photos: failure', async () => {
  fetchMock.get('/api/album/photos?album=AlbumID', { throws: new Error('View Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-id-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-photos-button'));
  });

  expect(fetchMock.calls('/api/album/photos?album=AlbumID')).toHaveLength(1);
  expect(screen.getByTestId('view-failure')).toBeInTheDocument();
}, 10000);
