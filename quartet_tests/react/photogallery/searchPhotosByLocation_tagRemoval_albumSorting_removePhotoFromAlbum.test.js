import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './searchPhotosByLocation_tagRemoval_albumSorting_removePhotoFromAlbum';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('should successfully search photos by location (from searchPhotosByLocation_tagRemoval)', async () => {
  fetchMock.get('/api/search?location=Paris', { photos: [{ id: 1, location: 'Paris' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'Paris' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('should fail to search photos by location with error message (from searchPhotosByLocation_tagRemoval)', async () => {
  fetchMock.get('/api/search?location=Paris', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'Paris' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No photos found')).toBeInTheDocument();
}, 10000);

test('Users can successfully remove tags from photos. (from searchPhotosByLocation_tagRemoval)', async () => {
  fetchMock.delete('/api/tags', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.queryByText('Nature')).not.toBeInTheDocument();
}, 10000);

test('Shows an error message when tag removal fails. (from searchPhotosByLocation_tagRemoval)', async () => {
  fetchMock.delete('/api/tags', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to remove tag')).toBeInTheDocument();
}, 10000);

test('Album Sorting: success (from albumSorting_removePhotoFromAlbum)', async () => {
  fetchMock.get('/api/albums?sortBy=date', { body: [{ id: 1, name: 'Album1' }] });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'date' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-button'));
  });

  expect(fetchMock.calls('/api/albums?sortBy=date')).toHaveLength(1);
  expect(screen.getByTestId('album-1')).toBeInTheDocument();
}, 10000);

test('Album Sorting: failure (from albumSorting_removePhotoFromAlbum)', async () => {
  fetchMock.get('/api/albums?sortBy=date', { throws: new Error('Sort Failed') });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'date' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-button'));
  });

  expect(fetchMock.calls('/api/albums?sortBy=date')).toHaveLength(1);
  expect(screen.getByTestId('sort-failure')).toBeInTheDocument();
}, 10000);

test('Users can successfully remove photos from an album. (from albumSorting_removePhotoFromAlbum)', async () => {
  fetchMock.delete('/api/albums/photos', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.queryByText('Photo removed')).toBeInTheDocument();
}, 10000);

test('Shows an error message when removing photo from album fails. (from albumSorting_removePhotoFromAlbum)', async () => {
  fetchMock.delete('/api/albums/photos', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to remove photo')).toBeInTheDocument();
}, 10000);

