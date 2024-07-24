import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import AddPhotoToAlbumComponent from './addPhotoToAlbum';

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

