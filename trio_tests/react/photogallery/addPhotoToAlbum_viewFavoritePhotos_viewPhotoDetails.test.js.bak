import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addPhotoToAlbum_viewFavoritePhotos_viewPhotoDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Users can successfully add photos to an album.', async () => {
  fetchMock.post('/api/albums/photos', { success: true });

  await act(async () => { render(<MemoryRouter><AddPhotoToAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('photo-input'), { target: { files: ['photo1.jpg'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Photo added')).toBeInTheDocument();
}, 10000);

test('Shows an error message when adding photo to album fails.', async () => {
  fetchMock.post('/api/albums/photos', { success: false });

  await act(async () => { render(<MemoryRouter><AddPhotoToAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('photo-input'), { target: { files: ['photo1.jpg'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to add photo')).toBeInTheDocument();
}, 10000);

test('Should successfully view all favorite photos.', async () => {
  fetchMock.get('/api/photo/favorites', { status: 200, body: { photos: ['Photo 1', 'Photo 2'] } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-favorites-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Photo 1')).toBeInTheDocument();
  expect(screen.getByText('Photo 2')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to view all favorite photos.', async () => {
  fetchMock.get('/api/photo/favorites', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-favorites-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load favorite photos')).toBeInTheDocument();
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
