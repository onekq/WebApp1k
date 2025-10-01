import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addPhotoToAlbum_searchPhotosByLocation_viewComments';

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

test('should successfully search photos by location', async () => {
  fetchMock.get('/api/search?location=Paris', { photos: [{ id: 1, location: 'Paris' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'Paris' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('should fail to search photos by location with error message', async () => {
  fetchMock.get('/api/search?location=Paris', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'Paris' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No photos found')).toBeInTheDocument();
}, 10000);

test('Should successfully view comments on a photo.', async () => {
  fetchMock.get('/api/photo/comments', { status: 200, body: { comments: ['Comment 1', 'Comment 2'] } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-comments-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment 1')).toBeInTheDocument();
  expect(screen.getByText('Comment 2')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to view comments on a photo.', async () => {
  fetchMock.get('/api/photo/comments', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('view-comments-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load comments')).toBeInTheDocument();
}, 10000);
