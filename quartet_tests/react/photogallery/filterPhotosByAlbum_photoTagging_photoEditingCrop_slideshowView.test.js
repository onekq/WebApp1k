import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterPhotosByAlbum_photoTagging_photoEditingCrop_slideshowView';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter Photos by Album: success (from filterPhotosByAlbum_photoTagging)', async () => {
  fetchMock.get('/api/photos?album=AlbumID', { body: [{ id: 1, name: 'Photo1' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-filter-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('filter-button'));
  });

  expect(fetchMock.calls('/api/photos?album=AlbumID')).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('Filter Photos by Album: failure (from filterPhotosByAlbum_photoTagging)', async () => {
  fetchMock.get('/api/photos?album=AlbumID', { throws: new Error('Filter Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('album-filter-input'), { target: { value: 'AlbumID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('filter-button'));
  });

  expect(fetchMock.calls('/api/photos?album=AlbumID')).toHaveLength(1);
  expect(screen.getByTestId('filter-failure')).toBeInTheDocument();
}, 10000);

test('Users can successfully add tags to photos. (from filterPhotosByAlbum_photoTagging)', async () => {
  fetchMock.post('/api/tags', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Nature' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Nature')).toBeInTheDocument();
}, 10000);

test('Shows an error message when tag addition fails. (from filterPhotosByAlbum_photoTagging)', async () => {
  fetchMock.post('/api/tags', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Nature' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to add tag')).toBeInTheDocument();
}, 10000);

test('should successfully crop a photo (from photoEditingCrop_slideshowView)', async () => {
  fetchMock.post('/api/crop', { id: 1, cropped: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('crop-input'), { target: { value: '100x100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('crop-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Photo cropped')).toBeInTheDocument();
}, 10000);

test('should fail to crop a photo with error message (from photoEditingCrop_slideshowView)', async () => {
  fetchMock.post('/api/crop', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('crop-input'), { target: { value: '100x100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('crop-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to crop photo')).toBeInTheDocument();
}, 10000);

test('should successfully view photos in slideshow mode (from photoEditingCrop_slideshowView)', async () => {
  fetchMock.get('/api/photos', { photos: [{ id: 1 }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('start-slideshow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('should fail to view photos in slideshow mode with error message (from photoEditingCrop_slideshowView)', async () => {
  fetchMock.get('/api/photos', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('start-slideshow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Cannot load slideshow')).toBeInTheDocument();
}, 10000);

