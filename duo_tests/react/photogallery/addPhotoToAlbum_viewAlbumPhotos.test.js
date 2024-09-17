import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addPhotoToAlbum_viewAlbumPhotos';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Users can successfully add photos to an album.', async () => {
  fetchMock.post('/api/albums/photos', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('photo-input'), { target: { files: ['photo1.jpg'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Photo added')).toBeInTheDocument();
}, 10000);

test('Shows an error message when adding photo to album fails.', async () => {
  fetchMock.post('/api/albums/photos', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('photo-input'), { target: { files: ['photo1.jpg'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to add photo')).toBeInTheDocument();
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