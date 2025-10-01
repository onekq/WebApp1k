import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './batchDeletePhotos_favoritePhoto_sortPhotosByTag';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('batch deletes multiple photos successfully', async () => {
  fetchMock.delete('/photos', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><BatchPhotoDeleteComponent /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-selected-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/photos deleted/i)).toBeInTheDocument();
}, 10000);

test('fails to batch delete multiple photos', async () => {
  fetchMock.delete('/photos', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><BatchPhotoDeleteComponent /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId('delete-selected-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/batch delete failed/i)).toBeInTheDocument();
}, 10000);

test('Should successfully mark a photo as favorite.', async () => {
  fetchMock.post('/api/photo/favorite', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('favorite-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('favorite-icon')).toBeInTheDocument();
}, 10000);

test('Should show error message when failing to mark a photo as favorite.', async () => {
  fetchMock.post('/api/photo/favorite', { status: 500 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('favorite-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to favorite photo')).toBeInTheDocument();
}, 10000);

test('should successfully sort photos by tag', async () => {
  fetchMock.get('/api/sort?tag=sunset', { photos: [{ id: 1, tag: 'sunset' }] });

  await act(async () => { render(<MemoryRouter><SortPhotos /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sort-input'), { target: { value: 'sunset' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('should fail to sort photos by tag with error message', async () => {
  fetchMock.get('/api/sort?tag=sunset', 404);

  await act(async () => { render(<MemoryRouter><SortPhotos /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('sort-input'), { target: { value: 'sunset' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No photos found')).toBeInTheDocument();
}, 10000);
