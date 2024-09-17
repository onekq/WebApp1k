import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterPhotosByAlbum_photoTagging';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter Photos by Album: success', async () => {
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

test('Filter Photos by Album: failure', async () => {
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

test('Users can successfully add tags to photos.', async () => {
  fetchMock.post('/api/tags', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Nature' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Nature')).toBeInTheDocument();
}, 10000);

test('Shows an error message when tag addition fails.', async () => {
  fetchMock.post('/api/tags', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Nature' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-tag-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to add tag')).toBeInTheDocument();
}, 10000);