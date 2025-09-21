import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './photoVisibility_slideshowView_sortPhotosByTag';

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

test('should successfully view photos in slideshow mode', async () => {
  fetchMock.get('/api/photos', { photos: [{ id: 1 }] });

  await act(async () => { render(<MemoryRouter><Slideshow /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('start-slideshow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('photo-1')).toBeInTheDocument();
}, 10000);

test('should fail to view photos in slideshow mode with error message', async () => {
  fetchMock.get('/api/photos', 404);

  await act(async () => { render(<MemoryRouter><Slideshow /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('start-slideshow-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Cannot load slideshow')).toBeInTheDocument();
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
