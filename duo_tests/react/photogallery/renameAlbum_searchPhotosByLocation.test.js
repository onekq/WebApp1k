import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './renameAlbum_searchPhotosByLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Users can successfully rename an album.', async () => {
  fetchMock.put('/api/albums', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('album-name-input'), { target: { value: 'NewAlbumName' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rename-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('NewAlbumName')).toBeInTheDocument();
}, 10000);

test('Shows an error message when renaming album fails.', async () => {
  fetchMock.put('/api/albums', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('album-name-input'), { target: { value: 'NewAlbumName' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('rename-album-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to rename album')).toBeInTheDocument();
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