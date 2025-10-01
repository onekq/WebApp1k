import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './likePhoto_revokeShare_viewAlbumPhotos';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Should successfully like a photo.', async () => {
  fetchMock.post('/api/photo/like', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('like-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('like-icon')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to like a photo.', async () => {
  fetchMock.post('/api/photo/like', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('like-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to like photo')).toBeInTheDocument();
}, 10000);

test('Revoke Share Link: success', async () => {
  fetchMock.post('/api/revokeShare', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('share-link-input'), { target: { value: 'link-id' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('revoke-share-button'));
  });

  expect(fetchMock.calls('/api/revokeShare')).toHaveLength(1);
  expect(screen.getByTestId('revoke-success')).toBeInTheDocument();
}, 10000);

test('Revoke Share Link: failure', async () => {
  fetchMock.post('/api/revokeShare', { throws: new Error('Revoke Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('share-link-input'), { target: { value: 'link-id' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('revoke-share-button'));
  });

  expect(fetchMock.calls('/api/revokeShare')).toHaveLength(1);
  expect(screen.getByTestId('revoke-failure')).toBeInTheDocument();
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
