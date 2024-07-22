import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './filterPhotosByAlbum';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter Photos by Album: success', async () => {
  fetchMock.get('/api/photos?album=AlbumID', { body: [{ id: 1, name: 'Photo1' }] });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
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
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
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

