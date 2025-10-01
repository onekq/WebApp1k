import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './photoVisibility_searchPhotosByTag_viewAlbumPhotos';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Photo Visibility Settings: success', async () => {
  fetchMock.post('/api/setPhotoVisibility', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('photo-id-input'), { target: { value: 'PhotoID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('visibility-toggle-button'));
  });

  expect(fetchMock.calls('/api/setPhotoVisibility')).toHaveLength(1);
  expect(screen.getByTestId('visibility-success')).toBeInTheDocument();
}, 10000);

test('Photo Visibility Settings: failure', async () => {
  fetchMock.post('/api/setPhotoVisibility', { throws: new Error('Visibility Change Failed') });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('photo-id-input'), { target: { value: 'PhotoID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('visibility-toggle-button'));
  });

  expect(fetchMock.calls('/api/setPhotoVisibility')).toHaveLength(1);
  expect(screen.getByTestId('visibility-failure')).toBeInTheDocument();
}, 10000);

test('should successfully search photos by tag', async () => {
  fetchMock.get('/api/search?tag=sunset', { photos: [{ id: 1, tag: 'sunset' }] });

  await act(async () => { render(<MemoryRouter><SearchPhotos /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'sunset' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('should fail to search photos by tag with error message', async () => {
  fetchMock.get('/api/search?tag=sunset', 404);

  await act(async () => { render(<MemoryRouter><SearchPhotos /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'sunset' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No photos found')).toBeInTheDocument();
}, 10000);

test('View Album Photos: success', async () => {
  fetchMock.get('/api/album/photos?album=AlbumID', { body: [{ id: 1, name: 'Photo1' }] });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
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
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
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
