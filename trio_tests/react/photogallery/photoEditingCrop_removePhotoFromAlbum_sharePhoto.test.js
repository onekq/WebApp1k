import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './photoEditingCrop_removePhotoFromAlbum_sharePhoto';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('should successfully crop a photo', async () => {
  fetchMock.post('/api/crop', { id: 1, cropped: true });

  await act(async () => { render(<MemoryRouter><CropPhoto /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('crop-input'), { target: { value: '100x100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('crop-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Photo cropped')).toBeInTheDocument();
}, 10000);

test('should fail to crop a photo with error message', async () => {
  fetchMock.post('/api/crop', 404);

  await act(async () => { render(<MemoryRouter><CropPhoto /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('crop-input'), { target: { value: '100x100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('crop-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to crop photo')).toBeInTheDocument();
}, 10000);

test('Users can successfully remove photos from an album.', async () => {
  fetchMock.delete('/api/albums/photos', { success: true });

  await act(async () => { render(<MemoryRouter><RemovePhotoFromAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.queryByText('Photo removed')).toBeInTheDocument();
}, 10000);

test('Shows an error message when removing photo from album fails.', async () => {
  fetchMock.delete('/api/albums/photos', { success: false });

  await act(async () => { render(<MemoryRouter><RemovePhotoFromAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to remove photo')).toBeInTheDocument();
}, 10000);

test('Share Photo: success', async () => {
  fetchMock.post('/api/sharePhoto', { body: { success: true } });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('photo-input'), { target: { value: 'PhotoID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-button'));
  });

  expect(fetchMock.calls('/api/sharePhoto')).toHaveLength(1);
  expect(screen.getByTestId('share-success')).toBeInTheDocument();
}, 10000);

test('Share Photo: failure', async () => {
  fetchMock.post('/api/sharePhoto', { throws: new Error('Share Failed') });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('photo-input'), { target: { value: 'PhotoID' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('share-button'));
  });

  expect(fetchMock.calls('/api/sharePhoto')).toHaveLength(1);
  expect(screen.getByTestId('share-failure')).toBeInTheDocument();
}, 10000);
