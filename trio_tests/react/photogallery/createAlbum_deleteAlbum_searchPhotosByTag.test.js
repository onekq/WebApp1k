import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './createAlbum_deleteAlbum_searchPhotosByTag';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Users can successfully create a new album.', async () => {
  fetchMock.post('/api/albums', { success: true });

  await act(async () => { render(<MemoryRouter><CreateAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('album-name-input'), { target: { value: 'Vacation' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('create-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Vacation')).toBeInTheDocument();
}, 10000);

test('Shows an error message when album creation fails.', async () => {
  fetchMock.post('/api/albums', { success: false });

  await act(async () => { render(<MemoryRouter><CreateAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('album-name-input'), { target: { value: 'Vacation' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('create-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to create album')).toBeInTheDocument();
}, 10000);

test('Users can successfully delete an album.', async () => {
  fetchMock.delete('/api/albums', { success: true });

  await act(async () => { render(<MemoryRouter><DeleteAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.queryByText('Album deleted')).toBeInTheDocument();
}, 10000);

test('Shows an error message when deleting album fails.', async () => {
  fetchMock.delete('/api/albums', { success: false });

  await act(async () => { render(<MemoryRouter><DeleteAlbumComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to delete album')).toBeInTheDocument();
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
