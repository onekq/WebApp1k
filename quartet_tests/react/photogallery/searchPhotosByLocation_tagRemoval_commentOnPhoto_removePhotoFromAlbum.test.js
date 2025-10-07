import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './searchPhotosByLocation_tagRemoval_commentOnPhoto_removePhotoFromAlbum';

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

test('Should successfully add a comment on a photo. (from commentOnPhoto_removePhotoFromAlbum)', async () => {
  fetchMock.post('/api/photo/comment', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Nice photo!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('comment-submit'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('comment-Nice photo!')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to add a comment. (from commentOnPhoto_removePhotoFromAlbum)', async () => {
  fetchMock.post('/api/photo/comment', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Nice photo!' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('comment-submit'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add comment')).toBeInTheDocument();
}, 10000);

test('Users can successfully remove photos from an album. (from commentOnPhoto_removePhotoFromAlbum)', async () => {
  fetchMock.delete('/api/albums/photos', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.queryByText('Photo removed')).toBeInTheDocument();
}, 10000);

test('Shows an error message when removing photo from album fails. (from commentOnPhoto_removePhotoFromAlbum)', async () => {
  fetchMock.delete('/api/albums/photos', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-photo-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to remove photo')).toBeInTheDocument();
}, 10000);

